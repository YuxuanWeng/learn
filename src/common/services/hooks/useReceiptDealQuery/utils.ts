import { noNil } from '@fepkg/common/utils';
import { TableSorter, TableSorterOrder } from '@fepkg/components/Table';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { InputFilter } from '@fepkg/services/types/bds-common';
import { ReceiptDealSortedField } from '@fepkg/services/types/bds-enum';
import { ReceiptDealSearch } from '@fepkg/services/types/receipt-deal/search';
import { QueryFunction } from '@tanstack/react-query';
import { omit } from 'lodash-es';
import moment from 'moment';
import { getParentPollingAPIPageCount } from '@/common/ab-rules';
import { fetchReceiptDeal } from '@/common/services/api/receipt-deal/search';
import { DynamicFilterParams, ReceiptDealFetchData } from '@/common/services/hooks/useReceiptDealQuery/types';
import { getInputFilter } from '@/common/utils/quote';
import {
  DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE,
  receiptDealFinishedStatuses,
  receiptDealUnfinishedStatuses
} from '@/pages/Deal/Receipt/ReceiptDealPanel/constants/filter';
import {
  ReceiptDealFilterState,
  ReceiptDealInputFilter,
  ReceiptDealRelatedFilter
} from '@/pages/Deal/Receipt/ReceiptDealPanel/types';

export const getReceiptDealQueryKey = (productType: ProductType, filterParams?: DynamicFilterParams) => {
  const queryKey: unknown[] = [APIs.receiptDeal.search_v2];

  if (productType != undefined) queryKey.push(productType);
  if (filterParams != undefined) queryKey.push({ ...filterParams });

  return queryKey as [string, ProductType, DynamicFilterParams | undefined];
};

type ReceiptDealQueryFn = {
  requestConfig?: RequestConfig;
  grantUserIdList?: string[];
  isOnOrBeforeFirstWorkdayOfMonth: boolean;
};
export const getReceiptDealQueryFn =
  ({
    requestConfig,
    grantUserIdList,
    isOnOrBeforeFirstWorkdayOfMonth
  }: ReceiptDealQueryFn): QueryFunction<ReceiptDealFetchData, ReturnType<typeof getReceiptDealQueryKey>> =>
  ({ signal, queryKey }) => {
    const [, productType, filterParams] = queryKey;
    const fetchParams = { product_type: productType, ...filterParams! };
    return fetchReceiptDeal({
      params: fetchParams,
      requestConfig: { ...requestConfig, signal },
      grantUserIdList,
      isOnOrBeforeFirstWorkdayOfMonth
    });
  };

export type ReceiptDealQueryFilterParams = {
  relatedFilterValue?: ReceiptDealRelatedFilter;
  inputFilter?: ReceiptDealInputFilter;
  searchValue?: InputFilter;
  sorter?: TableSorter<ReceiptDealSortedField>;
  page?: number;
};
export const getSorterMethod = (sorter?: TableSorter<ReceiptDealSortedField>) => {
  return sorter?.order && sorter?.sortedField
    ? { is_desc: sorter.order === TableSorterOrder.DESC, sorted_field: sorter.sortedField }
    : undefined;
};

const MonthAgo = moment().subtract(1, 'month').startOf('day');
export const getReceiptDealDynamicFilterParams = ({
  relatedFilterValue = DEFAULT_RECEIPT_DEAL_RELATED_FILTER_VALUE,
  inputFilter,
  searchValue,
  sorter,
  page = 1
}: ReceiptDealQueryFilterParams): DynamicFilterParams => {
  const count = getParentPollingAPIPageCount();
  // 解构赋值，避免直接修改原始的atom
  const relatedValue = { ...relatedFilterValue };
  if (!relatedValue.receipt_deal_status && relatedValue?.finished.includes(ReceiptDealFilterState.Finished)) {
    relatedValue.receipt_deal_status = receiptDealFinishedStatuses;
  }
  if (!relatedValue.receipt_deal_status && relatedValue?.finished.includes(ReceiptDealFilterState.Unfinished)) {
    relatedValue.receipt_deal_status = receiptDealUnfinishedStatuses;
  }
  if (!relatedValue.date_range) {
    // 兜底查询前一个月
    relatedValue.date_range = { start_time: MonthAgo.valueOf().toString() };
  }
  // 催单提醒默认本人成交单
  if (relatedValue.flag_urge) {
    relatedValue.flag_self = true;
  }
  return {
    table_related_filter: omit(relatedValue, 'finished'),
    receipt_deal_input_filter: noNil(inputFilter as ReceiptDealSearch.ReceiptDealInputFilter),
    input_filter: noNil(getInputFilter(searchValue)),
    sorting_method: getSorterMethod(sorter),
    offset: (page - 1) * count,
    count
  };
};
