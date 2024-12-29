import type { BaseResponse, DealOperationInfo, ReceiptDealDetail } from '../common';

/**
 * @description 批量重置桥信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_reset_bridge_info
 */
export declare namespace ReceiptDealMulResetBridgeInfo {
  type Request = {
    parent_receipt_deal_ids?: string[];
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_detail_list?: ReceiptDealDetail[];
  };
}
