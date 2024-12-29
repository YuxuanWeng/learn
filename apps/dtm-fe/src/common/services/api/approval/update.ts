import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ReceiptDealApprovalUpdate } from '@fepkg/services/types/receipt-deal/approval-update';
import request from '@/common/request';

/**
 * @description 审批流程更新
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/update
 */
export const updateApproval = (params: ReceiptDealApprovalUpdate.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalUpdate.Response>(APIs.receiptDealApproval.update, params, config);
};
