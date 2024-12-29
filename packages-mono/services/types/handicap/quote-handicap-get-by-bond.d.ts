import type { BaseResponse, BondQuoteHandicap } from '../common';

/**
 * @description 债券代码批量获取报价盘口信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/handicap/quote/get_by_bond
 */
export declare namespace QuoteHandicapGetByBond {
  type Request = {
    key_market_list?: string[]; // 债券KeyMarket列表
    only_optimal?: boolean; // 是否仅返回最优报价，默认为否，即返回全部报价
  };

  type Response = {
    base_response?: BaseResponse;
    quote_handicap_list?: BondQuoteHandicap[];
  };
}
