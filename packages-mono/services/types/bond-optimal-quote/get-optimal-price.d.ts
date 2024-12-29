import type { BaseResponse } from '../common';
import { BondQuoteType, ProductType } from '../enum';

export type BondOptimalPrice = {
  product_type: ProductType;
  bond_key_market: string;
  bond_id: string;
  bid_optimal_price?: QuotePrice;
  ofr_optimal_price?: QuotePrice;
};

export type QuotePrice = {
  quote_type: BondQuoteType;
  flag_rebate: boolean;
  flag_intention: boolean;
  yield?: number;
  clean_price?: number;
  full_price?: number;
  return_point?: number;
  quote_id: string;
  is_exercise?: boolean;
  quote_price?: number;
};

export type BondOptimalPriceStructV2 = {
  product_type: ProductType;
  bond_key_market: string;
  bond_id: string;
  bid_optimal_price?: QuotePrice[]; // 返回最多两条记录，用于前端排除当前报价后计算倒挂
  ofr_optimal_price?: QuotePrice[]; // 返回最多两条记录，用于前端排除当前报价后计算倒挂
};

/**
 * @description 根据 key market 获取最优报价的最优价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_optimal_quote/get_optimal_price
 */
export declare namespace BondOptimalQuoteGetOptimalPrice {
  type Request = {
    product_type: ProductType;
    key_market_list?: string[]; // 债券 key market list
  };

  type Response = {
    base_response?: BaseResponse;
    optimal_price_list?: BondOptimalPrice[];
    optimal_price_list_v2?: BondOptimalPriceStructV2[];
  };
}
