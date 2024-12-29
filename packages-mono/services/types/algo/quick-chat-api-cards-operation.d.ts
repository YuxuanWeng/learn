import type { BaseResponse, QuickChatCardInfo } from '../common';
import { BdsProductType, QuickChatCardsOperation } from '../enum';

/**
 * @description 快聊卡片点击删除/提交
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/cards_operation
 */
export declare namespace CardsOperation {
  type Request = {
    operation_type: QuickChatCardsOperation; // 操作类型
    card_info: QuickChatCardInfo; // 当前卡片信息
    room_id: string; // 房间id
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
