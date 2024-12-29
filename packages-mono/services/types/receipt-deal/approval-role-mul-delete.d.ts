import type { BaseResponse } from '../common';

/**
 * @description 删除审批角色
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_role/mul_delete
 */
export declare namespace ReceiptDealApprovalRoleMulDelete {
  type Request = {
    role_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
