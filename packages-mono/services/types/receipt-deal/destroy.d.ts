import type { BaseResponse, DealOperationInfo, ReceiptDealOperateIllegal } from '../common';

/**
 * @description 成交单毁单
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/destroy
 */
export declare namespace ReceiptDealDestroy {
  type Request = {
    destroyed_receipt_deal_list?: DestroyedReceiptDeal[];
    operation_info?: DealOperationInfo; // 操作类型
  };

  export type DestroyedReceiptDeal = {
    receipt_deal_id: string;
    reason: string; // 原因
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_operate_illegal_list?: ReceiptDealOperateIllegal[];
  };
}
