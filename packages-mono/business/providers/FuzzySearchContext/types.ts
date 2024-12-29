import { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export type UseFuzzySearchQueryParams<Response extends Record<string, unknown>, RequestParams> = {
  api: string;
  keyword: string;
  searchParams?: Omit<RequestParams, 'keyword'>;
  requestConfig?: RequestConfig;
  queryOptions?: Omit<
    UseQueryOptions<RequestResponse<Response>, unknown, RequestResponse<Response>>,
    'queryKey' | 'queryFn'
  >;
  onSelect?: (data: Response) => void;
  onQuery?: () => void;
  onSuccess?: (data: Response) => void;
  staleTime?: number;
  // 当关键词为空时仍触发搜索
  queryWhenEmpty?: boolean;
  // 跳过本地化检索，直接使用远程检索
  onlyRemoteQuery?: boolean;
};

export type FuzzySearchOptions = {
  fuzzySearchHook: <Response extends Record<string, unknown>, RequestParams>(
    param: UseFuzzySearchQueryParams<Response, RequestParams>
  ) => UseQueryResult<RequestResponse<Response>>;
};
