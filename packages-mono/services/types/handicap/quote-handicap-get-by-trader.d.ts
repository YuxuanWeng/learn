import type { BaseResponse, QuoteHandicap } from '../common';
import { ProductType } from '../enum';

/**
 * @description 交易员批量获取报价盘口信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/handicap/quote/get_by_trader
 */
export declare namespace QuoteHandicapGetByTrader {
  type Request = {
    trader_id: string; // 交易员id列表
    product_type?: ProductType[]; // 是否仅返回最优报价，默认为否，即返回全部报价
  };

  type Response = {
    base_response?: BaseResponse;
    quote_handicap_list?: QuoteHandicap[];
  };
}
