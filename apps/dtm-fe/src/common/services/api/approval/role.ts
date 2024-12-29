import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ProductType } from '@fepkg/services/types/enum';
import { ReceiptDealApprovalRoleGetAll } from '@fepkg/services/types/receipt-deal/approval-role-get-all';
import { ReceiptDealApprovalRoleMulDelete } from '@fepkg/services/types/receipt-deal/approval-role-mul-delete';
import { ReceiptDealApprovalRoleMulUpsert } from '@fepkg/services/types/receipt-deal/approval-role-mul-upsert';
import request from '@/common/request';

/**
 * @description 批量创建/更新审批角色
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_role/mul_upsert
 */
export const mulUpsertRole = (params: ReceiptDealApprovalRoleMulUpsert.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalRoleMulUpsert.Response, ReceiptDealApprovalRoleMulUpsert.Request>(
    APIs.receiptDealApproval.role.mulUpsert,
    params,
    config
  );
};

/**
 * @description 获取审批角色
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_role/get_all
 */
export const getAllRole = (product_type: ProductType, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalRoleGetAll.Response, ReceiptDealApprovalRoleGetAll.Request>(
    APIs.receiptDealApproval.role.getAll,
    { product_type },
    config
  );
};

/**
 * @description 删除审批角色
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval_role/mul_delete
 */
export const mulDeleteRole = (params: ReceiptDealApprovalRoleMulDelete.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealApprovalRoleMulDelete.Response, ReceiptDealApprovalRoleMulDelete.Request>(
    APIs.receiptDealApproval.role.mulDelete,
    params,
    config
  );
};
