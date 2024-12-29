import { UseFuzzySearchQueryParams } from '@fepkg/business/providers/FuzzySearchContext/types';
import { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { LocalFuzzySearch } from '@fepkg/services/types/data-localization-manual/fuzzy-search';
import { LocalInstTraderList } from '@fepkg/services/types/data-localization-manual/inst/trader-list';
import { InstFuzzySearch } from '@fepkg/services/types/inst/fuzzy-search';
import { LocalServerBaseDataBondSearch } from '@fepkg/services/types/local-server/base-data-bond-search';
import { LocalServerTraderSearch } from '@fepkg/services/types/local-server/trader-search';
import { UserList } from '@fepkg/services/types/user/list';
import { QueryFunction, UseQueryResult, useQuery } from '@tanstack/react-query';
import { isUseLocalServer } from '@/common/ab-rules';
import request from '@/common/request';
import { LocalizedAPIs, hasSearchAbilityAPIs, localFuzzySearch } from '@/common/request/local-fuzzy-search';
import { fetchLocalServerBondSearch } from '@/common/services/api/local-server/base-data-bond-search';
import { fetchLocalServerFuzzySearch } from '@/common/services/api/local-server/fuzzy-search';
import { fetchLocalServerInstSearch } from '@/common/services/api/local-server/inst-fuzzy-search';
import { fetchLocalServerInstTraderList } from '@/common/services/api/local-server/inst-trader-list';
import { fetchLocalServerTraderSearch } from '@/common/services/api/local-server/trader-search';
import { fetchLocalServerUserList } from '@/common/services/api/local-server/user-list';

const DEFAULT_STALE_TIME = 5000;

// 是否是复制的内容
const isParsingKeyword = (keyword: string) => {
  const regex = /[\s\t\n]/;
  return regex.test(keyword.trim());
};

const localServerFuzzySearch = async <Request, Response>(api: string, value: Request, config?: RequestConfig) => {
  switch (api) {
    case APIs.trader.search:
      return (await fetchLocalServerTraderSearch(value as LocalServerTraderSearch.Request, config)) as Response;
    case APIs.inst.fuzzySearch:
      return (await fetchLocalServerInstSearch(value as InstFuzzySearch.Request, config)) as Response;
    case APIs.user.list:
      return (await fetchLocalServerUserList(value as UserList.Request, config)) as Response;
    case APIs.baseData.bondSearch:
      return (await fetchLocalServerBondSearch(value as LocalServerBaseDataBondSearch.Request, config)) as Response;
    case APIs.inst.traderList:
      return (await fetchLocalServerInstTraderList(value as LocalInstTraderList.Request, config)) as Response;
    case APIs.baseData.search:
      return (await fetchLocalServerFuzzySearch(value as LocalFuzzySearch.Request, config)) as Response;
    default:
      throw new Error(`${api} can't use localServerRequest`);
  }
};

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
  queryWhenEmpty,
  onlyRemoteQuery
}: UseFuzzySearchQueryParams<RequestResponse<Response>, SearchParams>): UseQueryResult<RequestResponse<Response>> => {
  // const debounceKeyword = useDebounce(keyword, 40);

  const queryKey = [api, keyword, { ...searchParams }] as const;
  const queryFn: QueryFunction<RequestResponse<Response>> = async ({ signal }) => {
    onQuery?.();
    const needParse = hasSearchAbilityAPIs.includes(api) && isParsingKeyword(keyword);
    if (!onlyRemoteQuery && LocalizedAPIs.includes(api) && !needParse) {
      try {
        // 前端本地化与local server AB
        if (isUseLocalServer()) {
          return await localServerFuzzySearch<SearchParams | { keyword: string }, Response>(
            api,
            { keyword, ...searchParams },
            { signal }
          );
        }
        return await localFuzzySearch<SearchParams | { keyword: string }, Response>(api, {
          ...searchParams,
          keyword
        });
      } catch (err) {
        return request.post(api, { keyword, ...searchParams }, { signal, ...requestConfig });
      }
    }
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
    refetchOnWindowFocus: false,
    select: data => {
      onSelect?.(data);
      return data;
    },
    onSuccess
  });
};
