import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal } from '../common';

/**
 * @description 成交单删除桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/delete
 */
export declare namespace ReceiptDealBridgeDelete {
  type Request = {
    receipt_deal_ids_list?: ReceiptDealIdList[];
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };

  export type ReceiptDealIdList = {
    receipt_deal_id?: string[]; // 批量删除
  };
}
