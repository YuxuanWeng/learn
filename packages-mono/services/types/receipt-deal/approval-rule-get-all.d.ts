import type { BaseResponse, ReceiptDealApprovalRule } from '../common';
import { ProductType } from '../enum';

/**
 * @description 获取所有审批规则
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_rule/get_all
 */
export declare namespace ReceiptDealApprovalRuleGetAll {
  type Request = {
    product_type: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    rule_list?: ReceiptDealApprovalRule[];
  };
}
