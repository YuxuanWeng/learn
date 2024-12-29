import type { BaseResponse, BondQuote } from '../common';

/**
 * @description 批量获取报价详情
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_get
 */
export declare namespace BondQuoteMulGet {
  type Request = {
    quote_id_list?: string[]; // 报价ID
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
    quote_list?: BondQuote[];
  };
}
