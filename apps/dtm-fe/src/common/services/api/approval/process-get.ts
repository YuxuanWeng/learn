import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealApprovalGetProcess } from '@fepkg/services/types/receipt-deal/approval-get-process';
import request from '@/common/request';

/**
 * @description 获取审批流程
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/process/get
 */
export const getReceiptDealProcess = (params: ReceiptDealApprovalGetProcess.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalGetProcess.Response, ReceiptDealApprovalGetProcess.Request>(
    APIs.receiptDealApproval.processGet,
    params,
    config
  );
};
