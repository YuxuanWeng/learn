import { useEffect, useRef } from 'react';
import { QueryKey, useQueryClient } from '@tanstack/react-query';
import { useMemoizedFn } from 'ahooks';
import { createContainer } from 'unstated-next';

export const liveQueryObserverMapContainer = createContainer(() => {
  const queryClient = useQueryClient();
  const liveQueryObserverMap = useRef(new Map<string, QueryKey | undefined>());

  const handleVisibilityChange = useMemoizedFn(async () => {
    if (document.visibilityState === 'visible') {
      for await (const [_, queryKey] of liveQueryObserverMap.current) {
        if (queryKey) {
          await queryClient.refetchQueries(queryKey);
        }
      }
    }
  });

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange, false);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange, false);
    };
  }, [handleVisibilityChange]);

  return { liveQueryObserverMap };
});

/** @deprecated 此Provider已取消监听作用，请使用LocalDataProvider代替 */
export const LiveQueryMapObserverProvider = liveQueryObserverMapContainer.Provider;

export const useLiveQueryObserverMap = liveQueryObserverMapContainer.useContainer;
