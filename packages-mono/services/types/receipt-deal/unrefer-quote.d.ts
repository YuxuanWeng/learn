import type { BaseResponse } from '../common';

/**
 * @description 成交单列表反挂
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/quote/unrefer
 */
export declare namespace ReceiptDealUnreferQuote {
  type Request = {
    parent_deal_id: string;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
