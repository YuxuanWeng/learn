import { useMemo } from 'react';
import { TableSorter } from '@fepkg/components/Table';
import { RangeTime } from '@fepkg/services/types/common';
import { DealDateType, ProductType, QuoteSortedField } from '@fepkg/services/types/enum';
import { useTeamCollaboration } from '@/common/hooks/useTeamCollaboration';
import { DynamicFilterParams, useMarketDealQuery } from '@/common/services/hooks/useMarketDealQuery';
import { getSorterMethod } from '@/common/utils/quote';
import { usePollingActiveValue } from '../atoms';
import { PAGE_SIZE } from '../utils';

type Props = {
  productType: ProductType;
  code_market?: string;
  page: number;
  sorter?: TableSorter<QuoteSortedField>;
  dateRange?: RangeTime;
};

export const useDealTableData = ({ productType, dateRange, code_market, page, sorter }: Props) => {
  const { currProductTypeTeamBrokerIdList } = useTeamCollaboration();

  const active = usePollingActiveValue();
  const requestConfig = { interval: active ? 500 : Infinity };

  const filterParams: DynamicFilterParams = useMemo(
    () => ({
      product_type: productType,
      table_related_filter: {
        date_range: dateRange,
        date_type: DealDateType.DealTime
      },
      quick_filter: {
        intelligence_sorting: false
      },
      general_filter: {},
      input_filter: {
        bond_id_list: code_market === undefined ? undefined : [code_market]
      },
      sorting_method: getSorterMethod(sorter),
      followed_broker_id_list: currProductTypeTeamBrokerIdList,
      offset: (page - 1) * PAGE_SIZE,
      count: PAGE_SIZE
    }),
    [currProductTypeTeamBrokerIdList, dateRange, code_market, page, productType, sorter]
  );
  return {
    ...useMarketDealQuery({
      productType,
      filterParams,
      requestConfig
    })
  };
};
