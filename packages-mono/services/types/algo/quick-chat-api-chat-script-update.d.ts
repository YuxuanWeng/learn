import type { BaseResponse, QuickChatChatScript } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 更新自动发话术配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/chat_script_update
 */
export declare namespace ChatScriptUpdate {
  type Request = {
    chat_script_list?: QuickChatChatScript[];
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
