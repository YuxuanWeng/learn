import type { BaseResponse, OperationInfo } from '../common';

/**
 * @description 市场成交-批量删除操作
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_delete
 */
export declare namespace MarketDealMulDelete {
  type Request = {
    market_deal_id_list?: string[]; // ID
    operation_info: OperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
