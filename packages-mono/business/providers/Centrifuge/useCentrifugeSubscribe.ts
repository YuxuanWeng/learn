import { useRef } from 'react';
import { CentrifugeClient } from '@fepkg/centrifuge-client';
import { frontendSyncMsgScan } from '@fepkg/services/api/frontend-sync-msg/scan';
import { useMemoizedFn } from 'ahooks';
import { PublicationContext, SubscribedContext, SubscribingContext, SubscriptionErrorContext } from 'centrifuge';
import { CENTRIFUGE_HISTORY_SIZE, SERVER_HISTORY_SIZE } from './constants';
import { CentrifugeSubscribe, SyncInfo } from './type';

export const useCentrifugeSubscribe = ({
  centrifugeInstance,
  handleWsMessage,
  centrifugeState,
  setCentrifugeState,
  centrifugeConnect,
  logger
}: CentrifugeSubscribe) => {
  /** Centrifuge 监听的channel list */
  const centrifugeChannel = useRef<Set<string>>(new Set());
  /** Centrifuge 是否在尝试连接中 */
  const connecting = useRef<boolean>(false);
  /** Centrifuge 连接信息 */
  const syncInfo = useRef<SyncInfo>({
    offset: undefined,
    epoch: undefined
  });

  /** 更新SyncInfo */
  const updateSyncInfo = useMemoizedFn((info?: Partial<SyncInfo>) => {
    if (info?.offset !== undefined && info.offset > (syncInfo.current.offset ?? 0)) {
      syncInfo.current.offset = info.offset;
    }
    if (info?.epoch) syncInfo.current.epoch = info?.epoch;
  });

  /** 处理断网重连消息的缓存 */
  const consumeCache = useRef<PublicationContext[]>([]);

  /** 重连时尝试获取丢失的数据 */
  const recoverData = useMemoizedFn(async (ctx: SubscribedContext, channel: string) => {
    const { offset, epoch = '' } = syncInfo.current;
    try {
      setCentrifugeState('recover');
      const count = ctx.streamPosition && offset ? ctx.streamPosition.offset - offset : CENTRIFUGE_HISTORY_SIZE;
      let historyResult: PublicationContext[] = [];

      // 少量数据缺失走centrifuge恢复功能，大量缺失则走服务端缓存，超出缓存量则报错
      if (count <= CENTRIFUGE_HISTORY_SIZE) {
        const history = await centrifugeInstance.current?.getHistory(channel, {
          limit: count,
          since: { offset: offset ?? 0, epoch }
        });

        historyResult = history?.publications ?? [];
      } else if (offset && ctx?.streamPosition?.offset && count <= SERVER_HISTORY_SIZE) {
        const history = await frontendSyncMsgScan({
          channel,
          start_version: `${offset}`,
          end_version: `${ctx.streamPosition.offset}`
        });

        historyResult =
          history?.msg_list?.map(i => ({
            data: i.data,
            channel,
            offset: i.version !== undefined ? Number(i.version) : undefined
          })) ?? [];
      } else {
        throw new Error('Recover publications out of history_size.');
      }

      if (count !== historyResult.length) {
        throw new Error('Some publications stale dated.');
      }

      // 为了线程安全
      const tempConsumeCache: PublicationContext[] = [];
      while (consumeCache.current.length) {
        const item = consumeCache.current.shift();
        if (item) {
          tempConsumeCache.push(item);
        }
      }
      // concat 重连瞬间接受到的数据
      const publications = [...historyResult, ...tempConsumeCache];

      for (const p of publications) {
        handleWsMessage?.(p.channel, p.data);
      }
      // 更新offset
      updateSyncInfo({ offset: Math.max(...publications.map(p => p.offset ?? 0)) });
      setCentrifugeState('success');

      logger?.i({ keyword: 'centrifuge_ws_reconnect_success' });
    } catch (error) {
      setCentrifugeState('error');
      logger?.e({
        keyword: 'centrifuge_ws_reconnect_error',
        error
      });
    }
  });

  // 处理ws收到的消息
  const onPublish = (ctx: PublicationContext) => {
    // 正常接收消息
    if (centrifugeState !== 'recover') {
      // 先吐出缓存中的数据，为了线程安全采用shift操作，而不是解构后清空数组
      const tempConsumeCache: PublicationContext[] = [];
      while (consumeCache.current.length) {
        const item = consumeCache.current.shift();
        if (item) {
          tempConsumeCache.push(item);
        }
      }
      for (const p of tempConsumeCache) {
        handleWsMessage?.(p.channel, p.data);
      }

      handleWsMessage?.(ctx.channel, ctx.data);
      updateSyncInfo({ offset: ctx.offset });
    } else {
      // 数据恢复中暂不把新收到的消息更新到query中，待recover后会自动把consumeCache更新到query中
      consumeCache.current.push(ctx);
    }
  };

  /** 网络波动 */
  const onTempConnectionLoss = (ctx: SubscribingContext) => {
    setCentrifugeState('warning');
    logger?.e({
      keyword: 'centrifuge_ws_network_warning',
      ...ctx
    });
  };

  /** 丢包、重连时的兜底逻辑 */
  const onResubscribe = (ctx: SubscribedContext) => {
    if (syncInfo.current.offset !== ctx.streamPosition?.offset) {
      recoverData(ctx, ctx.channel);
    } else {
      setCentrifugeState('success');
    }
  };

  /** 未知异常报错 */
  const onError = (ctx: SubscriptionErrorContext) => {
    setCentrifugeState('error');
    logger?.e({
      keyword: 'centrifuge_ws_unknown_error',
      ...ctx
    });
  };

  /** 订阅centrifuge 单个channel */
  const subscribeToChannel = async (client: CentrifugeClient, channel: string) => {
    const subscribedContext = await client.subscribe<{ data: string }>(channel, {
      onPublish,
      onTempConnectionLoss,
      onResubscribe,
      onError
    });

    centrifugeChannel.current.add(channel);

    // 处理ws的Offset，以便和后端对齐数据
    updateSyncInfo({
      offset: subscribedContext.streamPosition?.offset ?? 0,
      epoch: subscribedContext.streamPosition?.epoch ?? ''
    });
  };

  /** 订阅centrifuge 多个channel */
  const centrifugeSubscribe = useMemoizedFn(async (channelList: string[]) => {
    if (!centrifugeInstance.current) {
      logger?.e({
        keyword: 'centrifugeClient is undefined'
      });
      setCentrifugeState('error');
      return;
    }

    // 未连接成功且没在重连时，尝试重新连接
    if (centrifugeState !== 'success' && !connecting.current) {
      connecting.current = true;
      await centrifugeConnect().finally(() => {
        connecting.current = false;
      });
    }

    const unsubscribedChannel = channelList.filter(i => !centrifugeChannel.current.has(i));

    if (!unsubscribedChannel.length) {
      return;
    }

    const client = centrifugeInstance.current;
    const subscribePromises = unsubscribedChannel.map(item => subscribeToChannel(client, item));

    // 使用 Promise.all 来并行执行所有的订阅
    await Promise.all(subscribePromises).catch(error => {
      setCentrifugeState('error');
      logger?.e({
        keyword: 'centrifuge_ws_subscribe_error',
        error
      });
    });
  });

  /** 取消订阅centrifuge 所有channel */
  const centrifugeUnSubscribe = useMemoizedFn(() => {
    for (const item of centrifugeChannel.current.values()) {
      centrifugeInstance.current?.unsubscribe(item);
    }
  });

  /** 获取所有centrifuge所在监听的channel */
  const getCentrifugeSubscribedChannel = () => {
    return centrifugeChannel.current;
  };

  return {
    /** 订阅centrifuge channel */
    centrifugeSubscribe,
    /** 取消订阅centrifuge 所有channel */
    centrifugeUnSubscribe,
    /** 获取所有centrifuge所在监听的channel */
    getCentrifugeSubscribedChannel
  };
};
