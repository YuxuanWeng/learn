import type { BaseResponse, ReceiptDeal } from '../common';
import { ReceiptDealConflictType } from '../enum';

/**
 * @description 根据成交单Id查询 轮询接口
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_get_by_id
 */
export declare namespace ReceiptDealMulGetById {
  type Request = {
    receipt_deal_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_info_list?: ReceiptDeal[];
    conflict_type_list?: ReceiptDealConflictType[];
  };
}
