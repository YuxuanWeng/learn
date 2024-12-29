import type { BaseResponse, QuickChatRoom } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 快聊获取聊天列表
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/chat_list_get
 */
export declare namespace ChatListGet {
  type Request = {
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    chat_list?: QuickChatRoom[];
  };
}
