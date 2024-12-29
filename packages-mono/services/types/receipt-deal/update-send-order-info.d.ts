import type { BaseResponse, DealOperationInfo } from '../common';
import { Side } from '../enum';

/**
 * @description 修改成交单发单信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/update_send_order_info
 */
export declare namespace ReceiptDealUpdateSendOrderInfo {
  type Request = {
    parent_deal_id: string; // 父id
    send_order_info: string; // 发单信息
    receipt_deal_id: string; // 发单id
    side: Side; // 方向
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
