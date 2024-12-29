import { useMemo } from 'react';
import { TableSorter, TableSorterOrder } from '@fepkg/components/Table/types';
import { APIs } from '@fepkg/services/apis';
import type { BondOptimalQuoteSearch } from '@fepkg/services/types/bond-optimal-quote/search';
import { ProductType, QuoteSortedField, Side } from '@fepkg/services/types/enum';
import { QueryFunction, useQuery } from '@tanstack/react-query';
import { useTeamCollaboration } from '@/common/hooks/useTeamCollaboration';
import request from '@/common/request';
import { DynamicFilterParams, getBondOptimalQuoteQueryKey } from '@/common/services/hooks/useBondOptimalQuoteQuery';
import { useBondQuoteQuery } from '@/common/services/hooks/useBondQuoteQuery';
import { OptimalTableColumn } from '@/pages/ProductPanel/components/OptimalTable/types';
import { usePollingActiveValue } from '../atoms';
import { QuoteFetchType } from '../components/ProductQuote/components/QuoteTable/types';
import { dataConvert, transform2OptimalTableColumn } from '../components/ProductQuote/components/QuoteTable/utils';
import { PAGE_SIZE, config } from '../utils';

type Props = {
  productType: ProductType;
  bondId?: string;
  quoteFlag: boolean;
  sorter?: TableSorter<QuoteSortedField>;
  side: Side;
};

export const useBondTableData = ({ productType, bondId, quoteFlag, sorter, side }: Props) => {
  const { currProductTypeTeamBrokerIdList } = useTeamCollaboration();

  const active = usePollingActiveValue();
  const requestConfig = { interval: active ? 500 : Infinity };
  const queryConfig = { ...config, ...requestConfig };

  // 最优报价的查询条件
  const filterParams: DynamicFilterParams = useMemo(
    () => ({
      product_type: productType,
      input_filter: {
        bond_id_list: [bondId || '']
      },
      table_related_filter: {
        side,
        broker_id_list: quoteFlag ? currProductTypeTeamBrokerIdList : undefined
      },
      quick_filter: {
        intelligence_sorting: false
      },
      general_filter: {},
      offset: 0,
      count: 1
    }),
    [productType, bondId, quoteFlag, currProductTypeTeamBrokerIdList, side]
  );

  const queryKey = getBondOptimalQuoteQueryKey(productType, filterParams);

  const queryFn: QueryFunction<QuoteFetchType> = async () => {
    const fetchParams = { product_type: productType, ...filterParams };
    const { optimal_quote_list = [] } = await request.post<BondOptimalQuoteSearch.Response>(
      APIs.bondOptimalQuote.search,
      fetchParams
    );
    const list = optimal_quote_list.map(item =>
      transform2OptimalTableColumn(productType, item, currProductTypeTeamBrokerIdList)
    ) as OptimalTableColumn[];
    return dataConvert(list, side, quoteFlag ? currProductTypeTeamBrokerIdList : []);
  };

  const optimalQuery = useQuery<QuoteFetchType, unknown>({
    queryKey,
    queryFn,
    staleTime: queryConfig?.interval,
    refetchInterval: queryConfig?.interval
  });

  const p = {
    product_type: productType,
    is_referred: false,
    quick_filter: {
      intelligence_sorting: false
    },
    general_filter: {},
    table_related_filter: {
      broker_id_list: quoteFlag ? currProductTypeTeamBrokerIdList : []
    },
    input_filter: {
      bond_id_list: [bondId || '']
    },
    sorting_method:
      sorter?.order && sorter?.sortedField
        ? { is_desc: sorter.order === TableSorterOrder.DESC, sorted_field: sorter.sortedField }
        : undefined,
    offset: 0,
    count: PAGE_SIZE * 2
  };

  const basicQuery = useBondQuoteQuery({
    productType,
    referred: false,
    filterParams: p,
    requestConfig
  });
  return sorter?.order ? basicQuery : optimalQuery;
};
