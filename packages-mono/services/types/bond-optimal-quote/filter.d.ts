import type { BaseResponse, BondOptimalQuote } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据债券标识获取最优报价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_optimal_quote/filter
 */
export declare namespace BondOptimalQuoteFilter {
  type Request = {
    product_type: ProductType;
    bond_key_list?: string[]; // 债券 bond_key list，如果需要跨市场债券的最优报价，则传此字段
    key_market_list?: string[]; // 债券 key market list
  };

  type Response = {
    base_response: BaseResponse;
    optimal_quote_list?: BondOptimalQuote[];
  };
}
