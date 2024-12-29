import type { BaseResponse } from '../common';
import { ImMsgSendStatus } from '../enum';

/**
 * @description 向 trader 发送即时消息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/spot_pricing/send_msg_to_trader
 */
export declare namespace SpotPricingSendMsgToTrader {
  type Request = {
    trader_id: string;
    message_record_id?: string;
    message_text: string;
    deal_id: string;
  };

  type Response = {
    base_response?: BaseResponse;
    im_msg_send_status: ImMsgSendStatus;
  };
}
