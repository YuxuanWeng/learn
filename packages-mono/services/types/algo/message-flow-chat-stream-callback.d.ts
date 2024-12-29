import type { BaseResponse } from '../common';

/**
 * @description QM聊天信息回调
 * @method POST
 * @url /api/v1/algo/abase/message_flow/chat_stream_callback
 */
export declare namespace AlgoAbaseMessageFlowChatStreamCallback {
  type Request = {
    event_ts: number;
    type: string;
    event_id: string;
    room_id: string;
    user_id: string;
    msg: string;
    joined?: string[];
  };

  type Response = {
    base_response: BaseResponse;
  };
}
