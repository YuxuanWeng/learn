import type { AutoQuoteQuickChat, BaseResponse } from '../common';

/**
 * @description 批量添加快聊识别(快聊使用)
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/mul_add_auto_quote
 */
export declare namespace MulAddAutoQuote {
  type Request = {
    auto_quote_quick_chat_list?: AutoQuoteQuickChat[];
  };

  type Response = {
    base_response: BaseResponse;
  };
}
