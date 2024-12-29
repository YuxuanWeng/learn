import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { v4 } from 'uuid';
import { useCentrifuge } from '../../providers/Centrifuge';
import { MessageFeedLiveQueryProps } from './types';

export const useMessageFeedLiveQuery = <Response>({
  centrifugeChannel,
  queryKey = [],
  queryFn,
  enabled,
  refetchInterval,
  handleWSMessage,
  onSuccess
}: MessageFeedLiveQueryProps<Response>) => {
  const [observerId] = useState(() => v4());

  const { centrifugeInit, centrifugeState, addCentrifugeQuery, deleteCentrifugeQuery, centrifugeSubscribe } =
    useCentrifuge();

  queryKey = ['useMessageFeedLiveQuery', centrifugeState, centrifugeChannel, [...queryKey]];

  // mount时订阅channel, unmount时无需取消订阅，channel可能还被其他地方引用，也不会无限扩张
  useEffect(() => {
    centrifugeInit();
    centrifugeSubscribe([centrifugeChannel]).catch(() => {});
  }, [centrifugeChannel, centrifugeInit, centrifugeSubscribe]);

  // unmount时删除监听的queryKey
  useEffect(() => {
    return () => {
      deleteCentrifugeQuery(centrifugeChannel, observerId);
    };
  }, [centrifugeChannel, observerId, deleteCentrifugeQuery]);

  const query = useQuery<Response | undefined, unknown>({
    queryKey,
    queryFn,
    enabled,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval,
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data'],
    onSuccess: data => {
      addCentrifugeQuery(centrifugeChannel, observerId, { queryKey, handleWSMessage });
      onSuccess?.(data);
    }
  });

  return { ...query, queryKey, centrifugeState };
};
