import type { BaseResponse } from '../common';

/**
 * @description 根据quote获取推荐债券(测试接口，不用于在线环境!!!)
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/recommend_bond_by_quote
 */
export declare namespace RecommendBondByQuote {
  type Request = {
    id: string;
    bond_code: string;
    broker_id: string;
    trader_id: string;
    side: string;
    price: number;
    clean_price: number;
    volume: number;
    time_to_maturity: string;
    listed_market: string;
    version: number;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    list?: RecommendBond[];
    base_response: BaseResponse;
  };

  export type RecommendBond = {
    trader_id: string;
    rule_group_list?: string[];
    extra_log?: string[];
  };
}
