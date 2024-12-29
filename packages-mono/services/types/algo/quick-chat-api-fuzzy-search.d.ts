import type { BaseResponse } from '../common';

/**
 * @description 模糊查询
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/fuzzy_search
 */
export declare namespace FuzzySearch {
  type Request = {
    keyword: string;
  };

  type Response = {
    base_response: BaseResponse;
    trader_list?: TraderInfo[];
  };

  export type TraderInfo = {
    trader_id: string; // 交易员id
    trader_name: string; // 交易员名字
    inst_name: string; // 机构名称
  };
}
