import type { BaseResponse, QuoteDraftDetailConfirm, QuoteDraftFailed, QuoteDraftMessageConfirm } from '../common';

/**
 * @description 修改忽略草稿
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote_draft/mul_confirm
 */
export declare namespace BondQuoteDraftMulConfirm {
  type Request = {
    message: QuoteDraftMessageConfirm;
    detail_list?: QuoteDraftDetailConfirm[];
  };

  type Response = {
    base_response?: BaseResponse;
    failed_list?: QuoteDraftFailed[]; // 因依赖数据失效而请求失败的原因
  };
}
