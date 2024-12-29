import {
  BCOProductMarketOptions,
  BNCProductMarketOptions,
  NCDProductMarketOptions
} from '@fepkg/business/constants/options';
import { noNil } from '@fepkg/common/utils';
import { TableSorter, TableSorterOrder } from '@fepkg/components/Table';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { TableRelatedDealApprovalFilter } from '@fepkg/services/types/bds-common';
import { ApprovalSortedField, ProductMarket } from '@fepkg/services/types/bds-enum';
import { ReceiptDealApprovalHistoryCheckUpdate } from '@fepkg/services/types/receipt-deal/approval-history-check-update';
import { QueryFunction } from '@tanstack/react-query';
import moment from 'moment';
import {
  ReceiptDealApprovalFetchData,
  fetchReceiptDealApproval,
  fetchReceiptDealApprovalHistory
} from '@/common/services/api/approval/search';
import { DynamicFilterParams } from '@/common/services/hooks/useReceiptDealApprovalSearch/types';
import {
  Completed,
  DEFAULT_APPROVAL_LIST_INPUT_FILTER_VALUE,
  DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE,
  HasExamined,
  InCompleted,
  ToBeExaminedByMyself
} from '@/pages/ApprovalList/constants/filter';
import { ApprovalListInputFilter, ApprovalListRelatedFilter, ApprovalListType } from '@/pages/ApprovalList/types';

export const getReceiptDealApprovalQueryKey = (filterParams: DynamicFilterParams, type: ApprovalListType) => {
  const queryKey: unknown[] = [
    type === ApprovalListType.Approval ? APIs.receiptDealApproval.search : APIs.receiptDealApproval.searchHistory,
    type
  ];

  if (filterParams != undefined) queryKey.push({ ...filterParams });

  return queryKey as [string, ApprovalListType, DynamicFilterParams | undefined];
};

export const getReceiptDealApprovalHistoryCheckUpdateQueryKey = (
  filterParams: Omit<ReceiptDealApprovalHistoryCheckUpdate.Request, 'product_type'>,
  type: ApprovalListType
) => {
  const queryKey: unknown[] = [APIs.receiptDealApproval.history.checkUpdate, type];

  queryKey.push(filterParams);

  return queryKey as [string, ApprovalListType, DynamicFilterParams | undefined];
};

export const getReceiptDealApprovalQueryFn =
  (
    requestConfig?: RequestConfig,
    userId?: string
  ): QueryFunction<ReceiptDealApprovalFetchData, ReturnType<typeof getReceiptDealApprovalQueryKey>> =>
  ({ signal, queryKey }) => {
    const [, type, filterParams] = queryKey;
    const fetchParams = { ...filterParams! };
    if (type !== ApprovalListType.Approval) {
      return fetchReceiptDealApprovalHistory({
        params: fetchParams,
        requestConfig: { ...requestConfig, signal }
      });
    }
    return fetchReceiptDealApproval({
      params: fetchParams,
      requestConfig: { ...requestConfig, signal },
      userId
    });
  };

export const getSorterMethod = (sorter?: TableSorter<ApprovalSortedField>) => {
  return sorter?.order && sorter?.sortedField
    ? { is_desc: sorter.order === TableSorterOrder.DESC, sorted_field: sorter.sortedField }
    : undefined;
};

export type ReceiptDealApprovalQueryFilterParams = {
  relatedFilterValue?: ApprovalListRelatedFilter;
  inputFilter?: ApprovalListInputFilter;
  sorter?: TableSorter<ApprovalSortedField>;
  page?: number;
  pageSize?: number;
  type: ApprovalListType;
};

const SixMonthAgo = moment().startOf('day').subtract(6, 'month');

const ThreeYearAgo = moment().startOf('day').subtract(3, 'year');

export const getReceiptDealApprovalDynamicFilterParams = (
  {
    relatedFilterValue = DEFAULT_APPROVAL_LIST_RELATED_FILTER_VALUE,
    inputFilter = DEFAULT_APPROVAL_LIST_INPUT_FILTER_VALUE,
    sorter,
    page = 1,
    pageSize = 30,
    type
  }: ReceiptDealApprovalQueryFilterParams,
  productTypeList?: ProductType[],
  flagSearchChild?: boolean
): DynamicFilterParams => {
  const {
    handled,
    completed,
    is_nc,
    flag_urgent,
    brokerage_type_list,
    is_advanced_approval,
    brokerage_comment_list,
    type_list,
    flag_printed,
    flag_history_pass,
    product_market_list
  } = relatedFilterValue;

  let traded_date_range = relatedFilterValue?.traded_date_range;
  let status_list = relatedFilterValue?.status_list;

  const productMarketList: ProductMarket[] = [];
  if (!product_market_list) {
    if (productTypeList?.includes(ProductType.BNC)) {
      productMarketList.push(...BNCProductMarketOptions.map(o => o.value as ProductMarket));
    }
    if (productTypeList?.includes(ProductType.BCO)) {
      productMarketList.push(...BCOProductMarketOptions.map(o => o.value as ProductMarket));
    }
    if (productTypeList?.includes(ProductType.NCD)) {
      productMarketList.push(...NCDProductMarketOptions.map(o => o.value as ProductMarket));
    }
  }

  const commonFilter = {
    product_market_list: product_market_list ?? productMarketList,
    flag_printed,
    flag_history_pass,
    filter: noNil({
      ...inputFilter,
      inst_user_input: inputFilter?.inst_id ? void 0 : inputFilter?.inst_user_input,
      trader_user_input: inputFilter?.trader_id ? void 0 : inputFilter?.trader_user_input,
      deal_price: inputFilter?.deal_price ? +inputFilter.deal_price : void 0,
      volume: inputFilter?.volume ? +inputFilter.volume * 100 : void 0
    } as TableRelatedDealApprovalFilter),
    sort_method: flagSearchChild ? getSorterMethod(sorter) : void 0,
    offset: (page - 1) * pageSize,
    count: pageSize,
    flag_search_child: flagSearchChild || void 0
  };

  if (type === ApprovalListType.Approval) {
    if (!traded_date_range) {
      traded_date_range = { start_time: SixMonthAgo.valueOf().toString() };
    }
    if (!status_list) {
      if (handled) {
        status_list = HasExamined;
      }
      if (handled === false) {
        status_list = ToBeExaminedByMyself;
      }
    }
    return {
      ...commonFilter,
      handled,
      status_list,
      flag_urgent,
      is_advanced_approval,
      type_list,
      traded_date_range
    };
  }

  if (!traded_date_range) {
    traded_date_range = { start_time: ThreeYearAgo.valueOf().toString() };
  }

  if (type === ApprovalListType.History) {
    if (!status_list) {
      if (completed) {
        status_list = Completed;
      }
      if (completed === false) {
        status_list = InCompleted;
      }
    }
  } else if (!status_list?.length) {
    status_list = Completed;
  }

  return {
    ...commonFilter,
    status_list,
    is_nc,
    brokerage_type_list,
    brokerage_comment_list,
    traded_date_range
  };
};
