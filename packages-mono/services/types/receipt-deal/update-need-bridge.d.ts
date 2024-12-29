import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 批量修改成交单待加桥状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/update_need_bridge
 */
export declare namespace ReceiptDealUpdateNeedBridge {
  type Request = {
    receipt_deal_id_list?: string[];
    need_bridge: boolean;
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
