import { useEffect, useRef, useState } from 'react';
import { TraceName } from '@fepkg/business/constants/trace-map';
import { LocalServerWsClientMessage, LocalServerWsServerMessage } from '@fepkg/services/types/bds-common';
import { LocalServerRealtimeScene, LocalServerRequestType, LocalServerWsMsgType } from '@fepkg/services/types/bds-enum';
import { newSpan } from '@fepkg/trace';
import { Context, context, propagation, trace } from '@opentelemetry/api';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { LocalServerEvent } from 'app/types/local-server';
import EventEmitter from 'events';
import { isEqual } from 'lodash-es';
import { createContainer } from 'unstated-next';
import { isUseLocalServer } from '@/common/ab-rules';
import { ResponseConfig, ResponseParam, WsRequestParam, WsResponseParam } from '@/common/providers/type';
import { logError } from '@/common/utils/logger/data';
import { miscStorage } from '@/localdb/miscStorage';
import { logger } from '../utils/logger';

const PING_TIME = 1.5 * 1000;
const TIME_OUT = 2 * 1000;
const REQUEST_TIME_OUT = 5 * 1000;
const RETRY_TIME = 5 * 1000;
const WsURL = 'ws://localhost';
const DefaultRequestInterval = 500;
const RETRY_TIMES = 3;

type LocalWebSocketInitProps = {
  isMain?: boolean;
};

const LocalWebSocketContainer = createContainer((initialState?: LocalWebSocketInitProps) => {
  const isMain = initialState?.isMain;
  /** websocket对象 */
  const websocket = useRef<WebSocket>();
  /** 上一次接收到ping时间戳 */
  const pingTimeStamp = useRef(0);
  /** ping计时器 */
  const pingTimer = useRef<NodeJS.Timeout>();
  /** 重连计时器 */
  const retryTimer = useRef<NodeJS.Timeout>();
  /** 失败次数 */
  const connectFailTimes = useRef(0);
  const [isRetry, setRetry] = useState(false);
  /** 该生命周期内，是否曾经可用过 */
  const [succeeded, setSucceeded] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [netReady, setNetReady] = useState(false);
  const [connectFailed, setConnectFailed] = useState(false);
  /** 注册的回调 */
  const registeredConfigCache = useRef(new Map<string, ResponseConfig>());
  /** 等待返回的请求 */
  const holdingRequestList = useRef(new Set<string>());
  /** 用于事件编程的消息总线（此处仅用于接收请求的ack） */
  const emitter = useRef(new EventEmitter());
  const queryClient = useQueryClient();
  /** pong函数，相应ping */
  const pong = (response_data: LocalServerWsServerMessage) => {
    const requestIdList: string[] = [];
    for (const requestId of registeredConfigCache.current.keys()) {
      requestIdList.push(requestId);
    }
    websocket.current?.send(
      JSON.stringify({
        msg_type: LocalServerWsMsgType.LocalServerWsMsgPong,
        alive_request_id_list: requestIdList
      } as LocalServerWsClientMessage)
    );
    setNetReady(response_data.net_is_ready ?? false);
    setDataReady(response_data.data_is_ready ?? false);

    const curLocalServerAvailable = response_data.net_is_ready && response_data.data_is_ready;
    if (!succeeded && curLocalServerAvailable) {
      setSucceeded(true);
    }
    if (isMain && !isEqual(miscStorage.localServerAvailable, curLocalServerAvailable)) {
      miscStorage.localServerAvailable = curLocalServerAvailable;
    }
  };

  /** 处理请求的主函数 */
  const handleRequest = async <Q, P>(params: WsRequestParam<Q>, traceCtx?: Context) => {
    return new Promise<WsResponseParam<P>>((resolve, reject) => {
      const ctx = traceCtx ?? context.active();
      const span = newSpan(TraceName.LOCAL_SERVER_REQUEST, undefined, ctx);
      const traceCarrier: { traceparent?: string } = {};
      propagation.inject(trace.setSpan(ctx, span), traceCarrier);

      span.addEvent('log', { log: `[handleRequest] start local_server request, params=${JSON.stringify(params)}` });

      const timer = setTimeout(() => {
        holdingRequestList.current.delete(params.request_id);

        logError({ keyword: 'local server request timeout' });
        span.addEvent('log', { log: '[handleRequest] local server request timeout' });
        span.end();
        reject(new Error('request timeout'));
      }, REQUEST_TIME_OUT);
      const handleResponse = (responseData: WsResponseParam<P>) => {
        holdingRequestList.current.delete(params.request_id);
        if (responseData.base_response?.code === 0) {
          clearTimeout(timer);
          span.end();
          resolve(responseData);
        } else {
          clearTimeout(timer);

          logError({ keyword: 'local server request failed', trace_id: responseData.base_response?.trace_id });
          span.addEvent('log', {
            log: `[handleRequest] local server request failed, response=${JSON.stringify(responseData)}`
          });
          span.end();
          reject(new Error('request failed'));
        }
      };
      emitter.current.once(params.request_id, handleResponse);
      const request = JSON.stringify({
        trace_parent: traceCarrier?.traceparent,
        ...params,
        msg_type: LocalServerWsMsgType.LocalServerWsMsgRequest,
        request_params: JSON.stringify(params.request_params)
      } as LocalServerWsClientMessage);
      holdingRequestList.current.add(params.request_id);
      websocket.current?.send(request);
    });
  };

  /** 注册轮询函数 */
  const registerRequest = async <Q, P>(
    scene: LocalServerRealtimeScene,
    request_id: string,
    request_params: Q,
    config: ResponseConfig
  ) => {
    registeredConfigCache.current.set(request_id, config);
    const response = await handleRequest<Q, P>(
      {
        request_id,
        request_type: LocalServerRequestType.Register,
        scene,
        interval: config?.interval || DefaultRequestInterval,
        request_params
      },
      config.traceCtx
    );
    return {
      response_data: response.response_data
    } as ResponseParam<P>;
  };

  /** 更新轮询函数 */
  const updateRequest = async <Q, P>(
    scene: LocalServerRealtimeScene,
    request_id: string,
    request_params: Q,
    config: ResponseConfig
  ) => {
    registeredConfigCache.current.set(request_id, config);
    const response = await handleRequest<Q, P>(
      {
        request_id,
        request_type: LocalServerRequestType.Update,
        scene,
        interval: config?.interval || DefaultRequestInterval,
        request_params
      },
      config?.traceCtx
    );
    return {
      response_data: response.response_data
    } as ResponseParam<P>;
  };

  /** 注销轮询函数 */
  const deRegisterRequest = (request_id: string) => {
    registeredConfigCache.current.delete(request_id);
  };

  /** 处理ws接收到的所有消息 */
  const handleMessage = (evt: MessageEvent<string>) => {
    pingTimeStamp.current = Date.now();

    const response = JSON.parse(evt.data) as LocalServerWsServerMessage;
    if (response?.msg_type === LocalServerWsMsgType.LocalServerWsMsgPing) {
      pong(response);
    } else if (response?.request_id) {
      const data = response.response_data ? JSON.parse(response.response_data) : undefined;
      console.log('local_server_ws_receive_message', response?.request_id, data);
      if (holdingRequestList.current.has(response.request_id)) {
        // 请求ack返回
        emitter.current.emit(response.request_id, { ...response, response_data: data } as WsResponseParam<any>);
      } else if (data) {
        // 已注册的回调
        const config = registeredConfigCache.current.get(response.request_id);
        if (config?.queryKey) {
          queryClient.setQueryData(config?.queryKey, data);
        }
      }
    } else {
      logError({
        keyword: 'local server respond invalid message without request_id.',
        data: response,
        trace_id: response?.base_response?.trace_id
      });
    }
  };

  const disconnect = () => {
    setDataReady(false);
    setNetReady(false);
    websocket.current?.close();
    websocket.current = undefined;
  };

  const connect = useMemoizedFn(async () => {
    const port = miscStorage.localServerPort;
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        logError({ keyword: 'local server connect timeout' });
        reject(new Error('Local Server连接超时'));
      }, TIME_OUT);
      let ws: WebSocket;
      const onError = (evt: Event) => {
        clearTimeout(timeout);
        logError({ keyword: 'local server connect error', error: evt });
        ws.removeEventListener('error', onError);
        ws.removeEventListener('close', onError);
        disconnect();
        reject(evt);
      };
      const onOpen = () => {
        clearTimeout(timeout);
        ws.removeEventListener('open', onOpen);
        resolve(void 0);
      };

      try {
        ws = new WebSocket(`${WsURL}:${port}/ws`);

        ws.addEventListener('open', onOpen);
        ws.addEventListener('error', onError);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', onError);
        // 重置时间戳
        pingTimeStamp.current = Date.now();
        websocket.current = ws;
      } catch (e) {
        onError(e as Event);
      }
    })
      .then(() => {
        if (isMain) {
          logger.i({ keyword: 'local_server_connect_success' });
        }
        setRetry(false);
        connectFailTimes.current = 0;
        /** 启动ping检测 */
        pingTimer.current = setInterval(() => {
          if (Date.now() - pingTimeStamp.current > TIME_OUT) {
            disconnect();
            clearInterval(pingTimer.current);
            logError({ keyword: 'local server ping time out，disconnected to reconnect.' });
          }
        }, PING_TIME);
      })
      .catch(() => {})
      .finally(() => {
        /** 启动尝试重连 */
        if (!retryTimer.current) {
          retryTimer.current = setInterval(() => {
            if (!websocket.current && !isRetry && connectFailTimes.current <= RETRY_TIMES) {
              connectFailTimes.current += 1;
              setRetry(true);
              connect();
            }
            if (connectFailTimes.current > RETRY_TIMES) {
              setConnectFailed(true);
              logError({
                keyword: `local server connect failed more than ${RETRY_TIMES} times, no more try to reconnect！`
              });
              clearInterval(retryTimer.current);
              retryTimer.current = void 0;
            }
          }, RETRY_TIME);
        }
      });
  });

  const retry = async () => {
    disconnect();
    connectFailTimes.current = 0;
    retryTimer.current = void 0;
    pingTimer.current = void 0;
    pingTimeStamp.current = 0;
    registeredConfigCache.current.clear();
    holdingRequestList.current.clear();
    setConnectFailed(false);
    setRetry(false);
    await window.Main.invoke(LocalServerEvent.Restart);
    miscStorage.localServerPort = await window.Main.invoke(LocalServerEvent.GetPort);
    await connect();
  };

  useEffect(() => {
    if (isMain) {
      miscStorage.localServerAvailable = false;
    }
    if (isUseLocalServer()) {
      connect();

      return () => {
        disconnect();
        clearInterval(pingTimer.current);
        clearInterval(retryTimer.current);
      };
    }
    return () => void 0;
  }, []);

  return {
    dataReady,
    netReady,
    succeeded,
    connectFailed,
    registeredConfigCache,
    retry,
    registerRequest,
    updateRequest,
    deRegisterRequest
  };
});

export const LocalWebSocketProvider = LocalWebSocketContainer.Provider;
export const useLocalWebSocket = LocalWebSocketContainer.useContainer;
