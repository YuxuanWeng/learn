import { useQuery } from '@tanstack/react-query';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import {
  QuoteDraftMessageListQueryResult,
  QuoteDraftMessageListQueryVars
} from '@/common/services/hooks/useLiveQuery/type';
import { useLiveQueryObserverMap } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { miscStorage } from '@/localdb/miscStorage';
import { useObserver } from '../useObserver';
import { API, QuoteDraftMessageListQueryKey } from './types';
import { fetchQuoteDraftMessageList } from './utils';

const action = DataLocalizationAction.QuoteDraftMessageList;

export const useQuoteDraftMessageListQuery = ({
  productType,
  status,
  creatorIdList,
  offset,
  count,
  timestamp,
  disabled,
  keepPrevious,
  onSuccess
}: QuoteDraftMessageListQueryVars) => {
  const userId = miscStorage.userInfo?.user_id;

  const { liveQueryObserverMap } = useLiveQueryObserverMap();
  // 创建 Observer
  const observerId = useObserver(action);

  const queryKey: QuoteDraftMessageListQueryKey = [
    API,
    { productType, status, userId, creatorIdList, offset, count, disabled }
  ];

  const enabled = creatorIdList && !!productType && offset !== undefined && count !== undefined;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetchQuoteDraftMessageList(observerId, { ...queryKey[1], timestamp });

      return {
        messages: res?.quote_draft_message_list ?? [],
        total: res?.total ?? 0,
        hasMore: res?.hasMore ?? false,
        latestCreateTime: res?.latestCreateTime
      } as QuoteDraftMessageListQueryResult;
    },
    enabled,
    keepPreviousData: keepPrevious ?? true,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    onSuccess: data => {
      onSuccess?.(data);
      liveQueryObserverMap.current.set(observerId, queryKey);
    }
  });

  return { queryKey, ...query };
};
