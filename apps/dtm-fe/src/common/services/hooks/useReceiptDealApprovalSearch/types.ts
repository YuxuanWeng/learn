import { UseDataQueryRequestConfig } from '@fepkg/request/types';
import { ReceiptDealApprovalSearch } from '@fepkg/services/types/receipt-deal/approval-search';
import { ReceiptDealApprovalSearchHistory } from '@fepkg/services/types/receipt-deal/approval-search-history';
import { QueryObserverResult, UseQueryResult } from '@tanstack/react-query';
import { ReceiptDealApprovalFetchData } from '@/common/services/api/approval/search';
import { ApprovalListType } from '@/pages/ApprovalList/types';

/** 动态筛选参数，考虑到接口的某些参数在固定场景是硬编码的，所以把剩下的参数提取出来作为动态筛选参数 */
export type DynamicFilterParams =
  | Omit<ReceiptDealApprovalSearch.Request, 'product_type'>
  | (Omit<ReceiptDealApprovalSearchHistory.Request, 'product_type'> & { completed?: boolean });

export type UseReceiptDealApprovalQueryParams = {
  /** 动态筛选参数 */
  filterParams: DynamicFilterParams;
  /** 筛选参数是否变化 */
  isFilterParamsChanged?: boolean;
  /** request 配置项 */
  requestConfig: UseDataQueryRequestConfig;
  /** 是否启用 logger */
  loggerEnabled?: boolean;
  /** 列表类型 */
  type: ApprovalListType;
};

export type UseReceiptDealApprovalQueryResult = UseQueryResult<ReceiptDealApprovalFetchData> & {
  /** Query refetch */
  handleRefetch: () => Promise<QueryObserverResult<ReceiptDealApprovalFetchData>>;
};

export type UseReceiptDealApprovalQuery = (
  params: UseReceiptDealApprovalQueryParams
) => UseReceiptDealApprovalQueryResult;

export type CheckUpdateResult = { need_update: boolean; filter_total: number };
