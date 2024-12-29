import { SafeValue } from '@fepkg/common/types';
import { parseJSON } from '@fepkg/common/utils';
import { RequestResponse } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { QuoteFilterGroup } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import type { FilterGroupGet } from '@fepkg/services/types/filter-group/get';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { ManageQueryResult } from '@/pages/ProductPanel/providers/MainGroupProvider/types';
import { fetchFilterGroup } from '../api/filter-group/get';

export type QuoteFilterGroupItem = Omit<QuoteFilterGroup, 'desc'> & { desc?: ManageQueryResult };

type FilterGroupFetchData = RequestResponse<FilterGroupGet.Response>;

const getFilterGroupQueryKey = (productTypeList: ProductType[]) => {
  return [APIs.filterGroup.get, productTypeList.join('-')] as const;
};

/**
 * @description 获取相应台子类型分组数据
 * @param productType 台子类型
 */

export const GROUP_LOOP_INTERVAL = 10000;
export const useFilterGroupQuery = <TSelectData = QuoteFilterGroupItem[]>(
  productTypeList?: ProductType[],
  queryOptions?: Omit<
    UseQueryOptions<FilterGroupFetchData, unknown, SafeValue<TSelectData, QuoteFilterGroupItem[]>>,
    'queryKey' | 'queryFn'
  >
) => {
  const queryKey = getFilterGroupQueryKey(productTypeList || []);
  return useQuery<FilterGroupFetchData, unknown, SafeValue<TSelectData, QuoteFilterGroupItem[]>>({
    queryKey,
    queryFn: ({ signal }) => {
      return fetchFilterGroup({ product_type_list: productTypeList || [] }, { signal });
    },
    refetchOnWindowFocus: true,
    refetchInterval: GROUP_LOOP_INTERVAL,
    ...queryOptions,
    select:
      queryOptions?.select ??
      (data => {
        return (data?.quote_filter_group_list?.map(item => ({
          ...item,
          desc: parseJSON<ManageQueryResult>(item.desc)
        })) ?? []) as SafeValue<TSelectData, QuoteFilterGroupItem[]>;
      })
  });
};
