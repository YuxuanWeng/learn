import type { BaseResponse } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description qq聊天信息流
 * @method POST
 * @url /api/v1/algo/abase/message_flow/qq_chat_stream
 */
export declare namespace AlgoAbaseMessageFlowQqChatStream {
  type Request = {
    msg_event: string; // 消息字符串
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
