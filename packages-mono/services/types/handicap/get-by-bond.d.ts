import type { BaseResponse, MarketDeal, QuoteHandicap } from '../common';

export type BondQuoteDealHandicap = {
  key_market: string;
  bid_optimal_quote?: QuoteHandicap[]; // bid方向最优价
  ofr_optimal_quote?: QuoteHandicap[]; // ofr方向最优价
  latest_market_deal?: MarketDeal; // 最新市场成交
};

/**
 * @description 债券代码批量获取报价&成交盘口信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/handicap/get_by_bond
 */
export declare namespace HandicapGetByBond {
  type Request = {
    key_market_list?: string[]; // 债券KeyMarket列表
    ignore_nd_deal?: boolean; // 忽略 nd 市场成交
  };

  type Response = {
    base_response?: BaseResponse;
    bond_handicap_list?: BondQuoteDealHandicap[];
  };
}
