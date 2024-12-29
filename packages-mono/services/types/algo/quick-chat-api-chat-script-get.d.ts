import type { BaseResponse, QuickChatChatScript } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 获取自动发话术配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/chat_script_get
 */
export declare namespace ChatScriptGet {
  type Request = {
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    chat_script_list?: QuickChatChatScript[];
  };
}
