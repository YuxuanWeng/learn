import type { BaseResponse, ReceiptDealApprovalRole } from '../common';
import { ProductType } from '../enum';

/**
 * @description 获取审批流程
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/process/get
 */
export declare namespace ReceiptDealApprovalGetProcess {
  type Request = {
    receipt_deal_id: string;
    product_type?: ProductType;
  };

  type Response = {
    base_response: BaseResponse;
    submitter: string; // 提交人ID
    submitter_name: string; // 提交人名字
    submit_time: string; // 提交时间
    advanced_approval_list?: ApprovalProcess[]; // 高级审批流程列表（先高级，后普通）
    normal_approval_list?: ApprovalProcess[]; // 普通审批流程列表
    associated_approval?: AssociatedApproval; // 关联的审批
  };

  export type ApprovalProcess = {
    approval_role: ReceiptDealApprovalRole; // 审批角色 & 对应的可以审批人的列表
    approver?: string; // 审批人Id
    approver_name?: string; // 审批人name
    approval_time?: string; // 审批时间
    flag_approval_pass?: boolean; // 是否通过
    flag_valid_approver?: boolean; // 审批人是否有效
  };

  export type AssociatedApproval = {
    approver?: string; // 审批人Id
    approver_name?: string; // 审批人name
    approval_time?: string; // 审批时间
    flag_approval_pass?: boolean; // 是否通过
    flag_valid_approver?: boolean; // 审批人是否有效
  };
}
