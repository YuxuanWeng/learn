import type { BaseResponse, DealOperationInfo, ReceiptDealDetail } from '../common';

/**
 * @description 重置桥信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/reset_bridge_info
 */
export declare namespace ReceiptDealResetBridgeInfo {
  type Request = {
    parent_receipt_deal_id: string;
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_detail: ReceiptDealDetail;
  };
}
