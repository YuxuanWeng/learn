import type { BaseResponse, DealOperationInfo } from '../common';
import { ProductType, ReceiptDealRuleSubtype, ReceiptDealRuleType } from '../enum';

/**
 * @description 批量创建/更新审批规则
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_rule/mul_upsert
 */
export declare namespace ReceiptDealApprovalRuleMulUpsert {
  type Request = {
    rule_list?: UpsertReceiptDealApprovalRule[];
    operation_info?: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };

  export type UpsertReceiptDealApprovalRule = {
    approval_rule_id?: string;
    rule_type?: ReceiptDealRuleType;
    is_active?: boolean; // 是否启用
    rule_name?: string;
    rule_subtype?: ReceiptDealRuleSubtype[];
    rule_subtype_name?: string;
    advanced_role_id_list?: string[]; // 高级审批角色
    normal_role_id_list?: string[]; // 普通审批角色
    product_type: ProductType; // 产品类型，英文简写
  };
}
