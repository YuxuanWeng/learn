import type { BaseResponse, NCDPCheck, NCDPInfoLiteUpdate, NCDPOperationInfo } from '../common';

/**
 * @description 更新NCD一级
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/ncdp/update
 */
export declare namespace BondQuoteNcdpUpdate {
  type Request = {
    ncdp_info_list?: NCDPInfoLiteUpdate[];
    operation_info: NCDPOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse; // 基础返回结构
    err_list?: NCDPCheck[];
  };
}
