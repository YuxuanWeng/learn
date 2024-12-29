import type { BaseResponse, Trader } from '../common';

/**
 * @description 获取批量获取 trader
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/trader/mul_get
 */
export declare namespace BaseDataTraderMulGet {
  type Request = {
    trader_id_list?: string[]; // trader id
  };

  type Response = {
    base_response?: BaseResponse;
    trader_list?: Trader[];
  };
}
