import { useQuery } from '@tanstack/react-query';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { SpotDate } from '@/components/IDCSpot/types';
import { useLiveQueryObserverMap } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { useObserver } from '../useObserver';
import { fetchQuoteList } from './utils';

const action = DataLocalizationAction.QuoteSearchByKeyMarket;

type UseBondQuoteLiveQueryParams = {
  params: {
    keyMarket?: string;
    brokerId?: string;
    spotDate?: SpotDate;
  };
  enabled?: boolean;
};

export const useBondQuoteLiveQuery = ({
  params: { keyMarket, spotDate, brokerId },
  enabled
}: UseBondQuoteLiveQueryParams) => {
  const { liveQueryObserverMap } = useLiveQueryObserverMap();

  // 创建 Observer
  const queryKey = [keyMarket, brokerId, spotDate] as const;
  const observerId = useObserver(action);
  const enable = enabled && Boolean(keyMarket);

  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!enable) {
        return void 0;
      }
      return fetchQuoteList(observerId, ...queryKey);
    },
    enabled: enable,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    select(data) {
      return data?.quote_list ?? [];
    },
    onSuccess: () => {
      liveQueryObserverMap.current.set(observerId, queryKey);
    }
  });

  return query;
};
