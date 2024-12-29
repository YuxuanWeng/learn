import { useEffect, useState } from 'react';
import { RequestParams } from '@fepkg/request/types';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { v4 } from 'uuid';
import localRequest from '@/common/request/local-request';
import { logError } from '@/common/utils/logger/data';
import { useLiveQueryObserverMap } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';

const liveObserver = (action: DataLocalizationAction, value: RequestParams) => {
  try {
    localRequest.postMessage({ action, value });
  } catch (error) {
    logError({ keyword: 'local_request_error', error });
  }
};

export const useObserver = (observerAction: DataLocalizationAction) => {
  const { liveQueryObserverMap } = useLiveQueryObserverMap();
  /** observer id */
  const [observerId] = useState(() => v4());
  // 创建 Observer
  useEffect(() => {
    const observerMap = liveQueryObserverMap.current;
    observerMap.set(observerId, undefined);
    liveObserver(observerAction, {
      type: 'sync',
      observer_id_list: [...liveQueryObserverMap.current.keys()]
    });

    return () => {
      // 移除 Observer
      if (observerMap) {
        liveObserver(observerAction, { observer_id: observerId, type: 'remove' });
        observerMap.delete(observerId);
      }
    };
  }, [observerId, observerAction, liveQueryObserverMap]);

  return observerId;
};
