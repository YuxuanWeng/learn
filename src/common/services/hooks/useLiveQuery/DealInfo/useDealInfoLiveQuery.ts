import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useQuery } from '@tanstack/react-query';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { useLiveQueryObserverMap } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { useObserver } from '../useObserver';
import { fetchDealRecordList } from './utils';

type UseDealRecordLiveQueryParams = {
  params: {
    product_type: ProductType;
    broker_list: string[];
    deal_time?: string;
  };
  enabled?: boolean;
  onSuccess?: () => void;
};

const action = DataLocalizationAction.DealRecordList;

export const useDealRecordLiveQuery = ({
  params: { product_type, broker_list, deal_time },
  enabled,
  onSuccess
}: UseDealRecordLiveQueryParams) => {
  const { liveQueryObserverMap } = useLiveQueryObserverMap();

  const queryKey = [product_type, broker_list, deal_time] as const;
  // 创建 Observer
  const observerId = useObserver(action);
  const enable = enabled && !!broker_list?.length;

  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!enable) {
        return void 0;
      }
      return fetchDealRecordList(observerId, ...queryKey);
    },
    enabled: enable,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    onSuccess: () => {
      liveQueryObserverMap.current.set(observerId, queryKey);
      onSuccess?.();
    }
  });

  return query;
};
