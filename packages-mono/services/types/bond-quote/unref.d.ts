import type { BaseResponse, OperationInfo, QuoteUpdate } from '../common';
import { QuoteRelatedInfoFailedType } from '../enum';

/**
 * @description 通过弹窗确认反撤单
 * @method POST
 * @deprecated mul_update instead
 * @url /api/v1/bdm/bds/bds_api/bond_quote/unref
 */
export declare namespace BondQuoteUnref {
  type Request = {
    quote_item: QuoteUpdate; // 报价修改
    operation_info: OperationInfo; // 操作类型
  };

  type Response = {
    status_code: number;
    status_msg: string;
    deleted_quote_id: string; // 被删除的报价ID
    base_response?: BaseResponse;
    deleted_quote_id_list?: string[]; // 被删除的报价ID列表
    created_quote_id_list?: string[]; // 被新增的报价ID列表
    covered_quote_id_list?: string[]; // 被覆盖的报价ID列表
    failed_type_list?: QuoteRelatedInfoFailedType[]; // 因依赖数据失效而请求失败的原因
  };
}
