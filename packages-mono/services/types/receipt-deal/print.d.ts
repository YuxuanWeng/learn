import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 成交单打印，后端不做成交单数据更改，只是为了生成成交单日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/print
 */
export declare namespace ReceiptDealPrint {
  type Request = {
    receipt_deal_ids?: string[];
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
