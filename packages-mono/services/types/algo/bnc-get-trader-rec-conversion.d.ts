import type { BaseResponse } from '../common';

/**
 * @description 获取用户推荐转化信息
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/get_trader_rec_conversion
 */
export declare namespace BncGetTraderRecConversion {
  type Request = {
    trader_id: string;
  };

  type Response = {
    base_response: BaseResponse;
    list?: BncTraderRecConversionInfo[];
  };

  export type BncTraderRecConversionInfo = {
    msg: string;
    is_bid: boolean;
    bid_time: string;
    send_time: string;
    rule_list?: string[];
  };
}
