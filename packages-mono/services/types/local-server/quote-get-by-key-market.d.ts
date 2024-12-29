import type { DealQuote } from '../common';

/**
 * @description 根据债券唯一标识查询本人报价
 * @method POST
 * @url /ws
 */
export declare namespace LocalServerQuoteGetByKeyMarket {
  type Request = {
    key_market: string; // 债券唯一标识
    broker_id: string;
  };

  type Response = {
    quote_list?: DealQuote[];
  };
}
