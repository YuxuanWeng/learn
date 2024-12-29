import type { BaseResponse, FiccBondBasic } from '../common';

/**
 * @description 根据发行商代码查询债券
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/filter
 */
export declare namespace BaseDataBondFilter {
  type Request = {
    issuer_code_list?: string[]; // 发行商代码
    listed_market?: string; // 流通市场
    offset: number;
    count: number;
  };

  type Response = {
    base_response?: BaseResponse;
    bond_basic_list?: FiccBondBasic[];
    total?: number;
  };
}
