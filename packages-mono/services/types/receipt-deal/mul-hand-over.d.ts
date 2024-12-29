import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 成交单批量移交
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_hand_over
 */
export declare namespace ReceiptDealMulHandOver {
  type Request = {
    deal_id_list?: string[]; // 成交记录ID
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    parent_id_list?: string[];
  };
}
