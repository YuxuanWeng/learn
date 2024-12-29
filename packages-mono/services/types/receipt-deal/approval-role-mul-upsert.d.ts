import type { BaseResponse, DealOperationInfo } from '../common';
import { ProductType } from '../enum';

/**
 * @description 批量创建/更新审批角色
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_role/mul_upsert
 */
export declare namespace ReceiptDealApprovalRoleMulUpsert {
  type Request = {
    role_list?: UpsertReceiptDealApprovalRole[];
    operation_info?: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };

  export type UpsertReceiptDealApprovalRole = {
    approval_role_id?: string; // 角色id
    approval_role_name?: string; // 角色名称
    approval_role_level?: number; // 角色级别
    role_member_id_list?: string[]; // 角色成员列表
    product_type: ProductType; // 产品类型，英文简写
  };
}
