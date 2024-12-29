import type { BaseResponse, QuoteDraftDetailUpsert, QuoteDraftFailed } from '../common';

/**
 * @description 批量修改草稿
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/detail/mul_update
 */
export declare namespace BondQuoteDraftDetailMulUpdate {
  type Request = {
    detail_list?: QuoteDraftDetailUpsert[];
  };

  type Response = {
    base_response?: BaseResponse;
    failed_list?: QuoteDraftFailed[];
  };
}
