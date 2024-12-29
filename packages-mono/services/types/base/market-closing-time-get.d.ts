import type { BaseResponse, MarketClosingTime } from '../common';
import { ProductType } from '../enum';

/**
 * @description 获取市场闭市时间
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/market_closing_time/get
 */
export declare namespace BaseMarketClosingTimeGet {
  type Request = {
    product_type: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
    market_closing_time: MarketClosingTime;
  };
}
