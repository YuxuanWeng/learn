import type { BaseResponse } from '../common';

/**
 * @description 根据主体获取对应trader(测试接口，不用于在线环境!!!)
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/recommend_trader_by_issuer
 */
export declare namespace RecommendTraderByIssuer {
  type Request = {
    issuer_id: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    list?: string[];
    base_response: BaseResponse;
  };
}
