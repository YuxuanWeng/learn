import type { BaseResponse, DealOperationInfo } from '../common';
import { Side } from '../enum';

/**
 * @description 成交单确认
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/confirm
 */
export declare namespace ReceiptDealConfirm {
  type Request = {
    receipt_deal_id: string;
    side: Side; // 方向 Bid=1/Ofr=2
    operation_info?: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
