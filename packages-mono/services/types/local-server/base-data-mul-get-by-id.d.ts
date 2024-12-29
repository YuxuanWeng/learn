import type { BaseResponse, FiccBondBasic, InstitutionTiny, Trader, User } from '../common';

/**
 * @description 根据id查询债券,机构,交易员,经纪人列表
 * @method POST
 * @url /base_data/mul_get_by_id
 */
export declare namespace LocalServerBaseDataMulGetById {
  type Request = {
    key_market_list?: string[];
    trader_id_list?: string[];
    inst_id_list?: string[];
    user_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    inst_list?: InstitutionTiny[];
    trader_list?: Trader[];
    user_list?: User[];
    bond_info_list?: FiccBondBasic[];
  };
}
