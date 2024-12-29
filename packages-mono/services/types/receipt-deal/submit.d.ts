import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 成交单提交
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/submit
 */
export declare namespace ReceiptDealSubmit {
  type Request = {
    receipt_deal_ids?: string[];
    operation_info?: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
