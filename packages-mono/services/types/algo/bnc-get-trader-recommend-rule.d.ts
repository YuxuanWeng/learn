import type { BaseResponse, BncTraderRecommendRule } from '../common';

/**
 * @description 获取利率债规则
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/get_trader_recommend_rule
 */
export declare namespace BncGetTraderRecommendRule {
  type Request = {
    trader_id: string;
  };

  type Response = {
    base_response: BaseResponse;
    list?: BncTraderRecommendRule[];
  };
}
