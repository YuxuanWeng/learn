import { UseFuzzySearchQueryParams } from '@fepkg/business/providers/FuzzySearchContext/types';
import { RequestResponse } from '@fepkg/request/types';
import { QueryFunction, UseQueryResult, useQuery } from '@tanstack/react-query';
import { useDebounce } from 'usehooks-ts';
import request from '@/common/request';

const DEFAULT_STALE_TIME = 5000;

export const useFuzzySearchQuery = <Response extends Record<string, unknown>, SearchParams>({
  api,
  keyword,
  searchParams,
  requestConfig,
  queryOptions,
  onSelect,
  onQuery,
  onSuccess,
  staleTime,
  queryWhenEmpty
}: UseFuzzySearchQueryParams<RequestResponse<Response>, SearchParams>): UseQueryResult<RequestResponse<Response>> => {
  const debounceKeyword = useDebounce(keyword, 40);
  const queryKey = [api, keyword ? debounceKeyword || keyword : keyword, { ...searchParams }] as const;
  const queryFn: QueryFunction<RequestResponse<Response>> = async ({ signal }) => {
    onQuery?.();
    return request.post(api, { keyword, ...searchParams }, { signal, ...requestConfig });
  };

  return useQuery<RequestResponse<Response>>({
    queryKey,
    queryFn,
    staleTime: staleTime ?? DEFAULT_STALE_TIME,
    cacheTime: staleTime ?? DEFAULT_STALE_TIME,
    ...queryOptions,
    enabled: (queryOptions?.enabled === undefined || queryOptions.enabled) && (!!keyword || !!queryWhenEmpty),
    refetchOnReconnect: 'always',
    select: data => {
      onSelect?.(data);
      return data;
    },
    onSuccess
  });
};
