import type { BaseResponse, NCDPInfo } from '../common';

/**
 * @description 通过id批量获取ncd一级
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/mul_get_by_id
 */
export declare namespace BondQuoteNcdpMulGetById {
  type Request = {
    ncdp_id_list?: string[];
  };

  type Response = {
    ncdp_list?: NCDPInfo[];
    base_response?: BaseResponse;
  };
}
