import type { BaseResponse, MarketDealCreate, OperationInfo, UpsertDealErrorRecord } from '../common';

/**
 * @description 市场成交-新增市场成交（支持批量）
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_create
 */
export declare namespace MarketDealMulCreate {
  type Request = {
    market_deal_create_list?: MarketDealCreate[]; // 市场成交-新增-结构体
    operation_info: OperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
    err_record_list?: UpsertDealErrorRecord[]; // 错误记录
    created_market_deal_id_list?: string[]; // 新增的市场成交ID列表
  };
}
