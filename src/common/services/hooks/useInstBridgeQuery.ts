import { SafeValue } from '@fepkg/common/types';
import { RequestResponse } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BridgeInstSearch } from '@fepkg/services/types/bridge/inst-search';
import { QueryFunction, UseQueryResult, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'usehooks-ts';
import request from '@/common/request';

const DEFAULT_STALE_TIME = 5000;

type InstBridgeFetchData = RequestResponse<BridgeInstSearch.Response>;

export const useInstBridgeQuery = (
  { keyword, product_type }: Partial<BridgeInstSearch.Request>,
  disabledWhenEmpty?: boolean
): UseQueryResult<SafeValue<InstBridgeFetchData, InstBridgeFetchData>> => {
  const debounceKeyword = useDebounce(keyword, 40);

  const queryKey = [APIs.bridge.instSearch, keyword ? debounceKeyword || keyword : keyword, product_type] as const;
  const queryFn: QueryFunction<RequestResponse<BridgeInstSearch.Response>> = async ({ signal }) => {
    return request.post(APIs.bridge.instSearch, { keyword: debounceKeyword, product_type, count: 20 }, { signal });
  };

  return useQuery<InstBridgeFetchData, unknown, SafeValue<InstBridgeFetchData, InstBridgeFetchData>>({
    queryKey,
    queryFn,
    staleTime: DEFAULT_STALE_TIME,
    cacheTime: DEFAULT_STALE_TIME,
    enabled: !disabledWhenEmpty || !!keyword,
    keepPreviousData: true,
    notifyOnChangeProps: ['data']
  });
};
