import type { BaseResponse } from '../common';

/**
 * @description 批量撤销操作
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_delete
 */
export declare namespace BondQuoteMulDelete {
  type Request = {
    quote_id_list?: string[]; // 报价ID
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
