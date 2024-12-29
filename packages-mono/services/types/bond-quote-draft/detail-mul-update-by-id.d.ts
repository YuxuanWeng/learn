import type { BaseResponse, QuoteDraftDetailUpsert, QuoteDraftFailed } from '../common';

/**
 * @description 根据id批量修改草稿
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/detail/mul_update_by_id
 */
export declare namespace BondQuoteDraftDetailMulUpdateById {
  type Request = {
    detail_id_list?: string[]; // 这些id必须归属同一消息下，如果跨消息会报错
    message_id?: string; // 修改同一消息下的所有detail，如果这个字段有值就忽略detail_id_list
    update_info: QuoteDraftDetailUpsert;
  };

  type Response = {
    base_response?: BaseResponse;
    failed_list?: QuoteDraftFailed[]; // 因依赖数据失效而请求失败的原因，现在应该仅有4，且仅当通过detail_id_list修改时才需要考虑
  };
}
