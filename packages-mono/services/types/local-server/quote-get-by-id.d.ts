import type { DealQuote } from '../common';

/**
 * @description 根据报价ID查询报价信息
 * @method POST
 * @url /ws
 */
export declare namespace LocalServerQuoteGetById {
  type Request = {
    quote_id: string;
  };

  type Response = {
    quote: DealQuote;
  };
}
