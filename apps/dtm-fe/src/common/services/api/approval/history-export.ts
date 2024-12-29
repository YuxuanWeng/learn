import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealApprovalHistoryExport } from '@fepkg/services/types/receipt-deal/approval-history-export';
import request from '@/common/request';

/**
 * @description 导出成交审批
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/history/export
 */
export const exportHistory = (params: ReceiptDealApprovalHistoryExport.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalHistoryExport.Response, ReceiptDealApprovalHistoryExport.Request>(
    APIs.receiptDealApproval.history.export,
    params,
    config
  );
};
