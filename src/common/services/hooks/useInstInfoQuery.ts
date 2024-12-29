import type { SafeValue } from '@fepkg/common/types';
import type { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { fetchInstInfo } from '@fepkg/services/api/base-data/inst-info-search';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataInstInfoSearch } from '@fepkg/services/types/base-data/inst-info-search';
import type { QueryFunction, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'usehooks-ts';

type InstInfoFetchData = RequestResponse<BaseDataInstInfoSearch.Response>;

/**
 * @description 获取发行人 / 担保人
 * @param keyword 关键词
 * @param type 搜索发行人 / 担保人，issuer 为发行人，warranter 为担保人
 * @param pagination 分页参数
 * @param requestConfig request 配置项
 * @param queryOptions query 配置项
 */
export const useInstInfoQuery = <TSelectData = InstInfoFetchData>(
  keyword: string,
  type: 'issuer' | 'warranter' = 'issuer',
  pagination = { offset: 0, count: 10 },
  requestConfig?: RequestConfig,
  queryOptions?: Omit<
    UseQueryOptions<InstInfoFetchData, unknown, SafeValue<TSelectData, InstInfoFetchData>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<SafeValue<TSelectData, InstInfoFetchData>> => {
  const debounceKeyword = useDebounce(keyword, 50);

  const queryKey = [
    APIs.baseData.instInfoSearch,
    keyword ? debounceKeyword || keyword : keyword,
    type,
    pagination
  ] as const;
  const queryFn: QueryFunction<InstInfoFetchData> = ({ signal }) => {
    let params = {};
    if (type === 'issuer') {
      params = { flag_issuer: true };
    } else if (type === 'warranter') {
      params = { flag_warranter: true };
    }
    return fetchInstInfo({ keyword: debounceKeyword, ...pagination, ...params }, { ...requestConfig, signal });
  };

  const enabled = Boolean(debounceKeyword && type);

  return useQuery<InstInfoFetchData, unknown, SafeValue<TSelectData, InstInfoFetchData>>({
    queryKey,
    queryFn,
    enabled,
    staleTime: 10 * 1000,
    ...queryOptions
  });
};

export const formatSelectOption = (data: InstInfoFetchData) => {
  const options = data?.inst_info_list?.map(inst => {
    return {
      label: inst.full_name_zh,
      value: inst.inst_code
    };
  });
  return { options, total: data.total };
};
