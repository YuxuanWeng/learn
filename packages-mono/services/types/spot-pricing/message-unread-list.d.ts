import type { BaseResponse, SpotPricingRecord } from '../common';

/**
 * @description 获取所有未读消息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/spot_pricing/message/unread/list
 */
export declare namespace SpotPricingMessageUnreadList {
  type Request = {
    // None in here...
  };

  type Response = {
    base_response?: BaseResponse;
    spot_pricing_record_list?: SpotPricingRecord[];
  };
}
