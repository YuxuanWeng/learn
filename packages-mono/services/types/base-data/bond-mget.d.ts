import type { BaseResponse, FiccBondBasic } from '../common';

/**
 * @description 根据债券标识获取债券
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/mget
 */
export declare namespace BaseDataBondMget {
  type Request = {
    bond_key_list?: string[]; // 债券标识
    with_maturity?: boolean; // 是否包含已到期债券
  };

  type Response = {
    base_response?: BaseResponse;
    bond_basic_list?: FiccBondBasic[];
  };
}
