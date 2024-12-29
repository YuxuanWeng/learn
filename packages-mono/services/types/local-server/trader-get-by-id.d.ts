import type { BaseResponse, Trader } from '../common';

/**
 * @description 根据交易员id查询交易员
 * @method POST
 * @url /trader/get_by_id
 */
export declare namespace LocalServerTraderGetById {
  type Request = {
    trader_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    trader_list?: Trader[];
  };
}
