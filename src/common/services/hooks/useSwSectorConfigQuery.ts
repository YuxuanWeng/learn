import { CascaderOption } from '@fepkg/components/Cascader';
import type { RequestConfig, RequestResponse } from '@fepkg/request/types';
import { fetchSwSectorInfo } from '@fepkg/services/api/sw-sector-info/get';
import { APIs } from '@fepkg/services/apis';
import type { SwSectorInfoGet } from '@fepkg/services/types/sw-sector-info/get';
import { useQuery } from '@tanstack/react-query';
import type { QueryFunction, UseQueryOptions } from '@tanstack/react-query';
import { CONFIG_QUERY_STALE_TIME } from '@/components/Filter/constants/options';

type ConfigFetchData = RequestResponse<SwSectorInfoGet.Response>;

export const useSwSectorConfigQuery = <TSelectData = CascaderOption[]>(
  requestConfig?: RequestConfig,
  queryOptions?: Omit<UseQueryOptions<ConfigFetchData, unknown, TSelectData>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = [APIs.swSectorInfo.get] as const;
  const queryFn: QueryFunction<ConfigFetchData> = ({ signal }) => {
    return fetchSwSectorInfo({ ...requestConfig, signal });
  };

  return useQuery<ConfigFetchData, unknown, TSelectData>({
    queryKey,
    queryFn,
    staleTime: CONFIG_QUERY_STALE_TIME,
    ...queryOptions,
    select:
      queryOptions?.select ??
      (data => {
        const nodes = data?.sectors?.map(sector => {
          const node: CascaderOption = {
            label: sector.sector_name_zh,
            value: sector.sector_code,
            depth: 1,
            children: sector?.subsectors?.map(subsector => ({
              label: subsector.subsector_name_zh,
              value: subsector.subsector_code,
              depth: 2
            }))
          };
          return node;
        });
        return (nodes ?? []) as unknown as TSelectData;
      })
  });
};
