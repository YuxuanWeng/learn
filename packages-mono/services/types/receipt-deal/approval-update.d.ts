import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 审批流程更新
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/update
 */
export declare namespace ReceiptDealApprovalUpdate {
  type Request = {
    receipt_deal_id: string;
    is_approved: boolean;
    disapproval_reason?: string;
    operation_info?: DealOperationInfo; // 操作类型
    flag_associate_disapproval?: boolean; // 是否关联退回
  };

  type Response = {
    base_response: BaseResponse;
  };
}
