import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 成交单桥关联
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/associate
 */
export declare namespace ReceiptDealBridgeAssociate {
  type Request = {
    receipt_deal_ids?: string[];
    operation_info?: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
