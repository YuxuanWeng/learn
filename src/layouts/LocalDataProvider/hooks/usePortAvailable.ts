import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  DataLocalizationAction,
  DataUpdateEventMessageResponse,
  DataUpdateEventMessageTypeEnum
} from 'app/types/DataLocalization';
import { DataLocalizationPostMessageDelayKey } from '@/common/request/local-request';
import { QuoteDraftMessageListQueryKey } from '@/common/services/hooks/useLiveQuery/QuoteDraftMessage/types';
import { QuoteDraftMessageListQueryResult } from '@/common/services/hooks/useLiveQuery/type';
import { trackDuration } from '@/common/utils/logger/point';
import { useLiveQueryObserverMap } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { draftDataIncrementalUpdater } from '@/pages/Quote/Collaborative/services';

export const usePortAvailable = () => {
  const { liveQueryObserverMap } = useLiveQueryObserverMap();
  const queryClient = useQueryClient();
  const [isPortAvailable, setPortAvailable] = useState(window.UtilityProcess.isPortAvailable());
  const timer = useRef<NodeJS.Timeout>();

  // TODO: 待观察，暂时保留log
  const callback = (val: boolean) => {
    console.log('callback setPortAvailable', val);
    setPortAvailable(val);
  };

  // 等待preload有port后触发回调
  useEffect(() => {
    window.UtilityProcess.addPortEventListener(callback);
    setPortAvailable(window.UtilityProcess.isPortAvailable());
    return () => {
      window.UtilityProcess.removePortEventListener(callback);
    };
  }, []);

  // 主动轮训检查PortStatus
  useEffect(() => {
    timer.current = setInterval(() => {
      const isAvailable = window.UtilityProcess.isPortAvailable();
      console.log('checkPortStatus', isAvailable);
      if (isAvailable) {
        setPortAvailable(isAvailable);
        clearInterval(timer.current);
      }
    }, 500);
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  // 监听数据变更状态
  useEffect(() => {
    if (!isPortAvailable) {
      return () => {};
    }
    console.log('add live listener');
    const dataUpdateOff = window.UtilityProcess.on<DataUpdateEventMessageResponse>(
      DataLocalizationAction.LiveDataUpdate,
      ctx => {
        const { notified_list, type } = ctx?.value ?? {};
        if (type === DataUpdateEventMessageTypeEnum.QuoteDraftMessageIncrement) {
          if (notified_list)
            for (const [observerId, response] of notified_list) {
              const queryKey = liveQueryObserverMap.current.get(observerId) as QuoteDraftMessageListQueryKey;
              if (queryKey) {
                const [, params] = queryKey;
                if (params.disabled) continue;

                queryClient.setQueryData<QuoteDraftMessageListQueryResult>(
                  queryKey,
                  (data = { messages: [], total: 0, hasMore: false }) => {
                    return draftDataIncrementalUpdater(queryKey, response, data);
                  }
                );
              }
            }
        } else if (notified_list) {
          for (const [observerId, value] of notified_list) {
            const queryKey = liveQueryObserverMap.current.get(observerId);
            if (queryKey) queryClient.setQueryData(queryKey, value);
          }
        }

        // 上报消息推送延迟至大盘，抽样上报
        if (ctx?.local_request_response_time) {
          const duration = Date.now() - ctx.local_request_response_time;
          trackDuration(DataLocalizationPostMessageDelayKey, duration, 0.5);
        }
      }
    );
    return () => {
      dataUpdateOff?.();
    };
  }, [liveQueryObserverMap, queryClient, isPortAvailable]);

  return { isPortAvailable };
};
