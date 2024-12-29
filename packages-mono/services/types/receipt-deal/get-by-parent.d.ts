import type { BaseResponse, ReceiptDeal } from '../common';

/**
 * @description 成交单查询（通过源成交单，可查询桥相关成交单）
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/get_by_parent
 */
export declare namespace ReceiptDealGetByParent {
  type Request = {
    parent_deal_ids?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_info?: ReceiptDeal[];
  };
}
