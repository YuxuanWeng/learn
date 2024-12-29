import type { BaseResponse, OperationInfo } from '../common';
import { RefType } from '../enum';

/**
 * @description 批量手动撤单
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_ref
 */
export declare namespace BondQuoteMulRef {
  type Request = {
    quote_id_list?: string[]; // 报价ID
    refer_type: RefType; // 撤单类型
    operation_info: OperationInfo; // 操作类型
    stc_force?: boolean; // stc报价强制更新
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
