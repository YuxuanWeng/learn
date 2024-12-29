import type { BaseResponse } from '../common';

/**
 * @description 更新消息状态为已读
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/spot_pricing/message/mark_read
 */
export declare namespace SpotPricingMessageMarkRead {
  type Request = {
    spot_pricing_message_id_list?: string[];
    spot_pricing_record_id?: string;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
