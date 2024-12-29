import type { BaseResponse, OperationInfo, QuoteUpdate } from '../common';
import { QuoteRelatedInfoFailedType } from '../enum';

/**
 * @description 批量修改操作
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/mul_update
 */
export declare namespace BondQuoteMulUpdate {
  type Request = {
    quote_item_list?: QuoteUpdate[]; // 报价ID
    operation_info?: OperationInfo; // 操作类型，当list中的每个子项都有操作类型时可以为空
  };

  type Response = {
    status_code: number;
    status_msg: string;
    refered_quote_id_list?: string[]; // 被撤单的报价ID列表
    base_response?: BaseResponse;
    deleted_quote_id_list?: string[]; // 被删除的报价ID列表
    ignored_quote_id_list?: string[]; // 被忽略的报价ID列表
    created_quote_id_list?: string[]; // 被新增的报价ID列表
    covered_quote_id_list?: string[]; // 被覆盖的报价ID列表
    failed_type_list?: QuoteRelatedInfoFailedType[]; // 因依赖数据失效而请求失败的原因
    success_quote_id_list?: string[]; // 成功的报价ID列表
  };
}
