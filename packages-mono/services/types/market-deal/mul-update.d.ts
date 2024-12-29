import type { BaseResponse, MarketDealUpdate, OperationInfo, UpsertDealErrorRecord } from '../common';

/**
 * @description 市场成交-修改市场成交，包含Undo（支持批量）
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_update
 */
export declare namespace MarketDealMulUpdate {
  type Request = {
    market_deal_update_list?: MarketDealUpdate[]; // 市场成交-修改-结构体
    operation_info?: OperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    err_record_list?: UpsertDealErrorRecord[]; // 错误记录
  };
}
