import { useEffect, useMemo, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { QueryFunction, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn, usePrevious } from 'ahooks';
import { isEqual } from 'lodash-es';
import { v4 } from 'uuid';
import { useLocalWebSocket } from '@/common/providers/LocalWebSocket';
import { ResponseConfig, ResponseParam } from '@/common/providers/type';
import { LocalServerLiveQueryProps } from '@/common/services/hooks/local-server/types';
import { getLocalServerLiveQueryKey } from '@/common/services/hooks/local-server/utils';
import { logError } from '@/common/utils/logger/data';

export const useLocalServerLiveQuery = <Request, Response, CacheType = Response>({
  api,
  scene,
  params,
  interval = 500,
  enabled = true,
  select,
  onSuccess
}: LocalServerLiveQueryProps<Request, Response, CacheType>) => {
  const { dataReady, netReady, registeredConfigCache, registerRequest, updateRequest, deRegisterRequest } =
    useLocalWebSocket();
  const queryClient = useQueryClient();
  const [requestId] = useState(() => v4());
  const queryKey = getLocalServerLiveQueryKey(api, params, interval);
  const prevQueryKey = usePrevious(queryKey);
  const enable = dataReady && netReady && enabled;

  const config: ResponseConfig = {
    interval,
    queryKey
  };

  const isFilterParamsChanged = useMemo(() => !isEqual(queryKey, prevQueryKey), [prevQueryKey, queryKey]);

  const queryFn: QueryFunction<Response | undefined> = useMemoizedFn(async () => {
    if (!enable || !params) {
      return void 0;
    }
    try {
      const needUpdate = registeredConfigCache.current.has(requestId);
      let result: ResponseParam<Response>;
      if (needUpdate) {
        result = await updateRequest<Request, Response>(scene, requestId, params, config);
      } else {
        result = await registerRequest<Request, Response>(scene, requestId, params, config);
      }
      return result.response_data;
    } catch (e: any) {
      deRegisterRequest(requestId);
      message.error(e?.message || '请求失败');
      if (isFilterParamsChanged) {
        queryClient.setQueryData(queryKey, () => void 0);
      }
      logError({
        keyword: 'local-server-request-fail',
        api,
        error: e,
        isRequestIdRegistered: registeredConfigCache.current.has(requestId)
      });
      throw e;
    }
  });

  useEffect(() => {
    if (!enable) {
      deRegisterRequest(requestId);
    }
    return () => {
      deRegisterRequest(requestId);
    };
  }, [deRegisterRequest, enable, requestId, scene]);

  const query = useQuery<Response | undefined, unknown, CacheType>({
    queryKey,
    queryFn,
    enabled: enable,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
    cacheTime: 0,
    retry: true,
    retryDelay: 2000,
    notifyOnChangeProps: ['data'],
    select,
    onSuccess
  });

  return query;
};
