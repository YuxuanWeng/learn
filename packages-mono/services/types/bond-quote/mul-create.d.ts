import type { BaseResponse, OperationInfo, QuoteInsert } from '../common';
import { QuoteRelatedInfoFailedType } from '../enum';

/**
 * @description 批量新增报价
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_create
 */
export declare namespace BondQuoteMulCreate {
  type Request = {
    quote_item_list?: QuoteInsert[]; // 报价结构
    operation_info: OperationInfo; // 操作类型
  };

  type Response = {
    status_code: number;
    status_msg: string;
    covered_quote_id_list?: string[]; // 被覆盖的报价ID列表
    created_quote_id_list?: string[]; // 新增的报价ID列表
    base_response?: BaseResponse; // 基础返回结构
    bond_short_name?: string;
    failed_type_list?: QuoteRelatedInfoFailedType[]; // 因依赖数据失效而请求失败的原因
  };
}
