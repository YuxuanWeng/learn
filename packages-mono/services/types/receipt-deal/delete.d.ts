import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal } from '../common';

/**
 * @description 成交单删除
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/delete
 */
export declare namespace ReceiptDealDelete {
  type Request = {
    receipt_deal_ids?: string[]; // 若有桥，查询桥相关的成交单ID 代入里面
    operation_info?: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
