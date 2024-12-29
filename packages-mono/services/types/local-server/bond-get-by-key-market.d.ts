import type { BaseResponse, FiccBondBasic } from '../common';

/**
 * @description 根据债券唯一标识查询债券
 * @method POST
 * @url /base_data/bond/get_by_key_market
 */
export declare namespace LocalServerBondGetByKeyMarket {
  type Request = {
    key_market_list?: string[]; // 债券唯一标识
  };

  type Response = {
    base_response?: BaseResponse;
    bond_basic_list?: FiccBondBasic[];
  };
}
