import type { BaseResponse, MarketDealOperationLog } from '../common';

/**
 * @description 根据市场成交ID获取市场成交日志
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_deal/get_operation_log
 */
export declare namespace MarketDealGetOperationLog {
  type Request = {
    market_deal_id?: string; // 市场成交ID
    offset: number; // 分页游标
    count: number; // 分页计数
  };

  type Response = {
    base_response?: BaseResponse;
    log_list?: MarketDealOperationLog[]; // 日志列表
    total: number; // 总数
  };
}
