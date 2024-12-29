import type { BaseResponse } from '../common';

/**
 * @description 前端确认自动发话术是否已经发送成功
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/auto_quote_confirm_msg
 */
export declare namespace AutoQuoteConfirmMsg {
  type Request = {
    ws_client_id: string;
    record_id: string;
    qm_id: string;
  };

  type Response = {
    base_response: BaseResponse;
    is_send: boolean;
  };
}
