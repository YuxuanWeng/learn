import { useQuery } from '@tanstack/react-query';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { fetchSingleQuote } from '@/common/services/hooks/useLiveQuery/BondQuote/utils';
import { useLiveQueryObserverMap } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { useObserver } from '../useObserver';

const action = DataLocalizationAction.QuoteSearchById;

type UseSingleBondQuoteLiveQueryParams = {
  params: {
    quoteId?: string;
  };
  enabled?: boolean;
};

export const useSingleBondQuoteLiveQuery = ({ params: { quoteId }, enabled }: UseSingleBondQuoteLiveQueryParams) => {
  const { liveQueryObserverMap } = useLiveQueryObserverMap();

  // 创建 Observer

  const queryKey = ['useSingleBondQuoteLiveQuery', quoteId] as const;
  const observerId = useObserver(action);
  const enable = enabled && Boolean(quoteId);

  const query = useQuery({
    queryKey,
    queryFn: () => {
      if (!enable) {
        return void 0;
      }
      return fetchSingleQuote(observerId, quoteId);
    },
    enabled: enable,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    select(data) {
      return data?.quote;
    },
    onSuccess: () => {
      liveQueryObserverMap.current.set(observerId, queryKey);
    }
  });

  return query;
};
