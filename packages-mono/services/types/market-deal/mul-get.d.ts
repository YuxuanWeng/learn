import type { BaseResponse, MarketDeal } from '../common';

/**
 * @description 批量获取市场成交详情
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_get
 */
export declare namespace MarketDealMulGet {
  type Request = {
    market_deal_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    market_deal_list?: MarketDeal[];
  };
}
