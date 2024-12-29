import type { BaseResponse, BondQuote } from '../common';

/**
 * @description 根据bond_id查询报价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/get_by_bond_id
 */
export declare namespace BondQuoteBondIdGet {
  type Request = {
    bond_id: string; // 债券代码
    refer_type_list?: number[]; // 报价refer类型列表
    create_time_from?: string; // 创建时间筛选
    create_time_to?: string; // 创建时间筛选
  };

  type Response = {
    status_code: number;
    status_msg: string;
    bond_quote_list?: BondQuote[];
    base_response?: BaseResponse;
  };
}
