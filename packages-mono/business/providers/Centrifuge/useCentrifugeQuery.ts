import { useRef } from 'react';
import { parseJSON } from '@fepkg/common/utils/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { CentrifugeQueryParam } from './type';

export const useCentrifugeQuery = () => {
  const queryClient = useQueryClient();

  /** 存储各个Observer所对应QueryKey，以便接收到消息时set数据 */
  const centrifugeQueryMap = useRef(new Map<string, CentrifugeQueryParam | undefined>());
  /** 存储各个channel对应的ObserverId，以便接收到某一channel消息时通知该channel下的所有Observer */
  const centrifugeObserverIdMap = useRef(new Map<string, string[]>());

  /** 处理ws接收到的消息 */
  const updateQueryData = useMemoizedFn(async (channel: string, wsData: string) => {
    const channelObserverIdList = centrifugeObserverIdMap.current.get(channel);
    const formatWSData: unknown = parseJSON(wsData) ?? wsData;
    console.log('接收到的服务端推送数据-------', formatWSData, channel, channelObserverIdList, Date.now());
    /** 若该channel下无Observer，则不更新 */
    if (!channelObserverIdList?.length) {
      return;
    }

    for (const observerId of channelObserverIdList) {
      const { queryKey, handleWSMessage } = centrifugeQueryMap.current.get(observerId) ?? {};

      if (queryKey) {
        queryClient.setQueryData(queryKey, prevData => {
          return handleWSMessage ? handleWSMessage(formatWSData, prevData) : formatWSData;
        });
      }
    }
  });

  /**
   * @param channel centrifuge的对应channel
   * @param observerId 业务自定义的使用场景
   * @param queryKey 需要接受ws消息query的queryKey
   * @description 添加centrifugeQuery
   */
  const addCentrifugeQuery = useMemoizedFn((channel: string, observerId: string, queryParam: CentrifugeQueryParam) => {
    const channelObserverIdList = centrifugeObserverIdMap.current.get(channel);
    let observerIdList: string[] = [];

    if (!channelObserverIdList?.length) {
      observerIdList = [observerId];
    } else {
      observerIdList = [...observerIdList, observerId];
    }

    centrifugeObserverIdMap.current.set(channel, observerIdList);
    centrifugeQueryMap.current.set(observerId, queryParam);
  });

  /**
   * @param channel centrifuge的对应channel
   * @param observerId 业务自定义的使用场景
   * @description 删除centrifugeQuery
   */
  const deleteCentrifugeQuery = useMemoizedFn((channel: string, observerId: string) => {
    const channelObserverIdList = centrifugeObserverIdMap.current.get(channel)?.filter(i => i !== observerId);
    if (!channelObserverIdList?.length) {
      centrifugeObserverIdMap.current.delete(channel);
    } else {
      centrifugeObserverIdMap.current.set(channel, channelObserverIdList);
    }

    centrifugeQueryMap.current.delete(observerId);
  });

  return {
    /** 添加centrifugeQuery */
    addCentrifugeQuery,
    /**  删除centrifugeQuery */
    deleteCentrifugeQuery,
    /** 处理ws接收到的消息 */
    updateQueryData
  };
};
