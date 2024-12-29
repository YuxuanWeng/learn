import { SelectOption } from '@fepkg/components/Select';
import type { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { fetchDistrictInfo } from '@fepkg/services/api/district-info/get';
import { APIs } from '@fepkg/services/apis';
import type { DistrictInfoGet } from '@fepkg/services/types/district-info/get';
import { useQuery } from '@tanstack/react-query';
import type { QueryFunction, UseQueryOptions } from '@tanstack/react-query';
import { CONFIG_QUERY_STALE_TIME } from '@/components/Filter/constants/options';

type ConfigFetchData = RequestResponse<DistrictInfoGet.Response>;

export const useDistrictConfigQuery = <TSelectData = SelectOption<string>[]>(
  requestConfig?: RequestConfig,
  queryOptions?: Omit<UseQueryOptions<ConfigFetchData, unknown, TSelectData>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = [APIs.districtInfo.get] as const;
  const queryFn: QueryFunction<ConfigFetchData> = ({ signal }) => {
    return fetchDistrictInfo({ ...requestConfig, signal });
  };

  return useQuery<ConfigFetchData, unknown, TSelectData>({
    queryKey,
    queryFn,
    staleTime: CONFIG_QUERY_STALE_TIME,
    ...queryOptions,
    select:
      queryOptions?.select ??
      (data => {
        const nodes = data?.provinces?.map(province => {
          const node: SelectOption<string> = {
            label: province.province_name_zh,
            value: province.province_code
          };
          return node;
        });
        return (nodes ?? []) as unknown as TSelectData;
      })
  });
};
