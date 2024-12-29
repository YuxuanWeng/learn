import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 成交单加急
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/urgent
 */
export declare namespace ReceiptDealUrgent {
  type Request = {
    receipt_deal_ids?: string[];
    flag_urgent: boolean; // true加急，false取消加急
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
