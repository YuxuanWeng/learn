import type { BaseResponse } from '../common';
import { ImMsgSendStatus } from '../enum';

/**
 * @description 同步发送信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/sync_im_message_status
 */
export declare namespace DealSyncImMsgStatus {
  type Request = {
    deal_id: string;
    message_text: string;
    im_msg_send_status: ImMsgSendStatus;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
