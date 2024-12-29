import type { BaseResponse } from '../common';

/**
 * @description 获取成交单
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/deal/list/get
 */
export declare namespace DealListGet {
  type Request = {
    offset: number;
    count: number;
    create_time_from?: string;
    create_time_to?: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    deal_info_list?: DealInfo[];
    total: number;
    base_response?: BaseResponse;
  };

  export type DealInfo = {
    contract_id?: string; // 成交单Id
    create_time?: string; // 创建时间
    update_time?: string; // 修改时间
    bid_trader_id?: string; // 买方交易员id
    ofr_trader_id?: string; // 卖方交易员id
    bond_code?: string; // 债券代码
  };
}
