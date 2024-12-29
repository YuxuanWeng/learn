import { useQuery } from '@tanstack/react-query';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { SpotDate } from '@/components/IDCSpot/types';
import { useLiveQueryObserverMap } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { useObserver } from '../useObserver';
import { fetchQuoteOptimalListMap } from './utils';

type UseBondOptimalQuoteLiveQueryParams = {
  params: {
    keyMarket?: string;
    spotDate?: SpotDate;
    ignoreRetail?: boolean;
    doOnSuccess?: (data) => void;
  };
  enabled?: boolean;
};

const action = DataLocalizationAction.QuoteSearchOptimalByKeyMarket;

export const useBondOptimalQuoteLiveQuery = ({
  params: { keyMarket, spotDate, ignoreRetail = true, doOnSuccess },
  enabled
}: UseBondOptimalQuoteLiveQueryParams) => {
  const { liveQueryObserverMap } = useLiveQueryObserverMap();

  const queryKey = [keyMarket, spotDate, ignoreRetail] as const;
  // 创建 Observer
  const observerId = useObserver(action);
  const enable = enabled && Boolean(keyMarket);

  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!enable) {
        return void 0;
      }
      return fetchQuoteOptimalListMap(observerId, ...queryKey);
    },
    enabled: enable,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    select(data) {
      return {
        keyMarket: data?.key_market ?? '',
        spotDate: data?.spot_date,
        bidOptimalQuoteList: data?.bid_optimal_quote_list ?? [],
        bidSubOptimalQuoteList: data?.bid_suboptimal_quote_list ?? [],
        ofrOptimalQuoteList: data?.ofr_optimal_quote_list ?? [],
        ofrSubOptimalQuoteList: data?.ofr_suboptimal_quote_list ?? []
      };
    },
    onSuccess(data) {
      doOnSuccess?.(data);
      liveQueryObserverMap.current.set(observerId, queryKey);
    }
  });

  return { ...query };
};
