import { useEffect, useRef, useState } from 'react';
import { CentrifugeClient, Status } from '@fepkg/centrifuge-client';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';
import { CentrifugeInitialState } from './type';
import { useCentrifugeConnect } from './useCentrifugeConnect';
import { useCentrifugeQuery } from './useCentrifugeQuery';
import { useCentrifugeSubscribe } from './useCentrifugeSubscribe';

/** 提供处理服务端消息推送的能力 */
// @ts-ignore
export const CentrifugeContainer = createContainer((initialState: CentrifugeInitialState) => {
  const { token, env, websocket, websocketHost, logger } = initialState;

  /** Centrifuge 实例 */
  const centrifugeInstance = useRef<CentrifugeClient | null>(null);
  /** Centrifuge连接状态 */
  const [centrifugeState, setCentrifugeState] = useState<Status>('idle');

  const { addCentrifugeQuery, deleteCentrifugeQuery, updateQueryData } = useCentrifugeQuery();

  const { centrifugeConnect, centrifugeDisconnect } = useCentrifugeConnect({
    centrifugeInstance,
    setCentrifugeState,
    logger
  });

  const { centrifugeSubscribe, centrifugeUnSubscribe, getCentrifugeSubscribedChannel } = useCentrifugeSubscribe({
    centrifugeInstance,
    handleWsMessage: updateQueryData,
    centrifugeState,
    setCentrifugeState,
    centrifugeConnect,
    logger
  });

  /** centrifuge初始化 */
  const centrifugeInit = useMemoizedFn(async () => {
    if (centrifugeInstance.current) return;
    if (!token) return;

    centrifugeInstance.current = new CentrifugeClient({
      token,
      env,
      websocket,
      websocketHost
    });
  });

  /** centrifuge注销 */
  const centrifugeDestructor = useMemoizedFn(() => {
    centrifugeUnSubscribe();
    centrifugeDisconnect();
  });

  useEffect(() => {
    return () => {
      centrifugeDestructor();
    };
  }, [centrifugeDestructor]);

  return {
    centrifugeInit,
    centrifugeState,
    getCentrifugeSubscribedChannel,
    centrifugeSubscribe,
    addCentrifugeQuery,
    deleteCentrifugeQuery
  };
});

export const CentrifugeProvider = CentrifugeContainer.Provider;
export const useCentrifuge = CentrifugeContainer.useContainer;
