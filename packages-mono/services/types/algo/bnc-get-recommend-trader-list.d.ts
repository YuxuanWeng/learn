import type { BaseResponse } from '../common';

/**
 * @description 获取地方债推荐用户列表
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/get_recommend_trader_list
 */
export declare namespace BncGetRecommendTraderList {
  type Request = {
    code_market: string;
    trader_id?: string;
    key_market?: string;
  };

  type Response = {
    base_response: BaseResponse;
    list?: BncRecommendTrader[];
  };

  export type BncRecommendTrader = {
    trader_id: string;
    trader_name: string;
    inst_name: string;
    recommend_id: string;
    rule_list?: string[];
    broker_list?: BncRecommendBroker[];
  };

  export type BncRecommendBroker = {
    broker_qm_id: string;
    broker_name: string;
  };
}
