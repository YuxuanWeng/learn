import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { ReceiptDealApprovalRuleGetAll } from '@fepkg/services/types/receipt-deal/approval-rule-get-all';
import { ReceiptDealApprovalRuleMulUpsert } from '@fepkg/services/types/receipt-deal/approval-rule-mul-upsert';
import request from '@/common/request';

/**
 * @description 批量创建/更新审批规则
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_rule/mul_upsert
 */
export const mulUpsertRule = (params: ReceiptDealApprovalRuleMulUpsert.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalRuleMulUpsert.Response, ReceiptDealApprovalRuleMulUpsert.Request>(
    APIs.receiptDealApproval.rule.mulUpsert,
    params,
    config
  );
};

/**
 * @description 获取所有审批规则
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_rule/get_all
 */
export const getAllRule = (product_type: ProductType, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalRuleGetAll.Response, ReceiptDealApprovalRuleGetAll.Request>(
    APIs.receiptDealApproval.rule.getAll,
    { product_type },
    config
  );
};
