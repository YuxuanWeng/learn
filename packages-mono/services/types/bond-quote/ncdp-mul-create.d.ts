import type { BaseResponse, NCDPCheck, NCDPInfoLite, NCDPOperationInfo } from '../common';

/**
 * @description 批量新增NCD一级
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/mul_create
 */
export declare namespace BondQuoteNcdpMulCreate {
  type Request = {
    ncdp_info_list?: NCDPInfoLite[];
    operation_info: NCDPOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse; // 基础返回结构
    err_list?: NCDPCheck[];
  };
}
