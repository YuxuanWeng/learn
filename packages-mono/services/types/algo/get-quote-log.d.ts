import type { BaseResponse, DealLog } from '../common';

/**
 * @description 获取推荐债券
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/get_quote_log
 */
export declare namespace GetQuoteLog {
  type Request = {
    trader_id: string;
    bond_category: string;
    time: string;
  };

  type Response = {
    code: number;
    msg: string;
    result?: DealLog[];
    base_response: BaseResponse;
  };
}
