import { BaseResponse } from '../../bdm-common';
import { FiccBondBasic } from '../../bds-common';

/**
 * @description 读取本地数据库中的债券信息
 */
export declare namespace LocalBondGetByKeyMarketList {
  type Request = {
    key_market_list: string[];
  };

  type Response = {
    bond_list?: FiccBondBasic[];
    base_response?: BaseResponse;
  };
}
