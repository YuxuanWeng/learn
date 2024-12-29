import type { BaseResponse, QuoteDraftFailed } from '../common';
import { QuoteDraftIgnoreType } from '../enum';

/**
 * @description 修改忽略草稿
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/mul_ignore
 */
export declare namespace BondQuoteDraftMulIgnore {
  type Request = {
    ignore_type: QuoteDraftIgnoreType;
    creator_id_list?: string[]; // 只能操作关注人创建的审核条目
    detail_id_list?: string[]; // 批量操作对应条目，这些id必须归属同一消息下，如果跨消息会报错，且不能用于一键忽略
    message_id_list?: string[]; // 忽略某条消息下的条目
    request_time?: string; // 未指定具体detail_id时需要传入此值，表示只忽略此次操作时间点前的数据
  };

  type Response = {
    base_response?: BaseResponse;
    failed_list?: QuoteDraftFailed[]; // 因依赖数据失效而请求失败的原因，现在应该仅有4，且仅当通过detail_id_list修改时才需要考虑
  };
}
