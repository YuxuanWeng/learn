import type { BaseResponse, MarketClosingTime } from '../common';
import { ProductType } from '../enum';

/**
 * @description 市场闭市时间设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/market_closing_time/upsert
 */
export declare namespace BaseMarketClosingTimeUpsert {
  type Request = {
    product_type: ProductType;
    market_closing_time: MarketClosingTime;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
