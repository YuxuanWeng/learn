import type { DealQuote } from '../common';
import { OptimalQuoteSettlementType } from '../enum';

/**
 * @description 根据债券唯一标识查询最优报价，忽略散量
 * @method POST
 * @url /ws
 */
export declare namespace LocalServerOptimalQuoteGetByKeyMarket {
  type Request = {
    key_market: string; // 债券唯一标识
    settlement_type_list?: OptimalQuoteSettlementType[];
    simplified?: boolean; // 精简模式
  };

  type Response = {
    bid_optimal_list?: DealQuote[];
    bid_sub_optimal_list?: DealQuote[];
    ofr_optimal_list?: DealQuote[];
    ofr_sub_optimal_list?: DealQuote[];
  };
}
