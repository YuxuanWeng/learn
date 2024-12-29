import type { BaseResponse } from '../common';

/**
 * @description 自动挂单模糊搜索
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/auto_quote_field_search
 */
export declare namespace AutoQuoteFieldSearch {
  type Request = {
    keyword: string; // 模糊搜索关键词
    broker_qm_id: string; // broker的qmId
  };

  type Response = {
    base_response: BaseResponse;
    bond_info_list?: BondInfo[];
    trader_info_list?: AutoQuoteTraderInfo[];
  };

  export type BondInfo = {
    code_market: string; // 券码
    bond_short_name: string; // 债券简称
  };

  export type AutoQuoteTraderInfo = {
    trader_idb_key: string; // trader idbKey
    trader_name: string; // trader姓名
    inst_name: string; // trader机构名
  };
}
