import { useMemo } from 'react';
import { usePrevious } from '@fepkg/common/hooks';
import { TableSorter, TableSorterOrder } from '@fepkg/components/Table';
import { RangeTime } from '@fepkg/services/types/common';
import { ProductType, QuoteSortedField, RefType } from '@fepkg/services/types/enum';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';
import { fetchBondQuote } from '@/common/services/api/bond-quote/search';
import {
  BondQuoteFetchData,
  DynamicFilterParams,
  getBondQuoteQueryKey
} from '@/common/services/hooks/useBondQuoteQuery';
import { usePollingActiveValue } from '../atoms';
import { PAGE_SIZE, config, refetchInterval, staleTime } from '../utils';

type Props = {
  productType: ProductType;
  key_market?: string;
  page: number;
  sorter?: TableSorter<QuoteSortedField>;
  dateRange?: RangeTime;
  referTypeList?: RefType[]; // 撤销类型
};

export const useReferredTableData = ({ productType, key_market, dateRange, page, referTypeList, sorter }: Props) => {
  const filterParams: DynamicFilterParams = useMemo(
    () => ({
      product_type: productType,
      is_referred: true,
      general_filter: {},
      quick_filter: {
        intelligence_sorting: false
      },
      input_filter: {
        key_market_list: key_market === undefined ? undefined : [key_market]
      },
      table_filter: {},
      table_related_filter: {
        ref_type_list: referTypeList && referTypeList.length > 0 ? referTypeList : undefined,
        date_range: dateRange
      },
      sorting_method:
        sorter?.order && sorter?.sortedField
          ? { is_desc: sorter.order === TableSorterOrder.DESC, sorted_field: sorter.sortedField }
          : undefined,
      offset: (page - 1) * PAGE_SIZE,
      count: PAGE_SIZE
    }),
    [key_market, dateRange, page, productType, referTypeList, sorter?.order, sorter?.sortedField]
  );
  const prevFilterParams = usePrevious(filterParams);
  const isFilterParamsChanged = useMemo(
    () => !isEqual(filterParams, prevFilterParams),
    [filterParams, prevFilterParams]
  );

  const fetchParams = { product_type: productType, is_referred: true, ...filterParams };

  const active = usePollingActiveValue();
  const requestConfig = { interval: active ? 500 : Infinity };
  const queryConfig = { ...config, ...requestConfig };

  const queryKey = getBondQuoteQueryKey(productType, true, filterParams);
  const queryFn: QueryFunction<BondQuoteFetchData> = ({ signal }) =>
    fetchBondQuote({
      params: fetchParams,
      paramsChanged: isFilterParamsChanged,
      requestConfig: { ...queryConfig, signal }
    });

  const query = useQuery<BondQuoteFetchData, unknown>({
    queryKey,
    queryFn,
    staleTime,
    refetchInterval,
    refetchOnReconnect: 'always',
    keepPreviousData: true,
    enabled: key_market !== undefined
  });

  return query;
};
