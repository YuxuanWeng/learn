import type { BaseResponse, NCDPOperationInfo } from '../common';

/**
 * @description 删除NCD一级
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/delete
 */
export declare namespace BondQuoteNcdpDelete {
  type Request = {
    ncdp_id_list?: string[];
    operation_info: NCDPOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse; // 基础返回结构
  };
}
