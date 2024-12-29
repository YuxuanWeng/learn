import type { BaseResponse, ReceiptDealApprovalRole } from '../common';
import { ProductType } from '../enum';

/**
 * @description 获取审批角色
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_role/get_all
 */
export declare namespace ReceiptDealApprovalRoleGetAll {
  type Request = {
    product_type: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    role_list?: ReceiptDealApprovalRole[];
  };
}
