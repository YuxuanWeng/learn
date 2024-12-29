import type { BaseResponse, LiquidationSpeed } from '../common';
import { BondQuoteType, Direction, ProductType } from '../enum';

export type dealByQuotesParams = {
  quote_id: string;
  bid_trader_id?: string;
  bid_broker_id: string;
  bid_inst_id?: string;
  ofr_trader_id?: string;
  ofr_broker_id: string;
  ofr_inst_id?: string;
  bid_trader_tag?: string;
  ofr_trader_tag?: string;
  current_quote_volume: number; // 当前报价量
  deal_volume: number; // 成交量
  direction: Direction;
  price: number;
  price_type: BondQuoteType;
  return_point?: number;
  product_type: ProductType;
  liquidation_speed_list?: LiquidationSpeed[];
  bond_key_market: string;
  bond_code_market: string;
  flag_stock_exchange: boolean;
  traded_date?: string;
  settlement_date?: string;
  is_exercise: number;
};

/**
 * @description 通过quotes点价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/deal_by_quotes
 */
export declare namespace DealDealByQuotes {
  type Request = {
    deal_by_quotes_params_list?: dealByQuotesParams[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
