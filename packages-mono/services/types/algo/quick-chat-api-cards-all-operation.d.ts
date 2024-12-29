import type { BaseResponse, OperationFailed, QuickChatCardInfo } from '../common';
import { BdsProductType, QuickChatCardsOperation } from '../enum';

/**
 * @description 快聊卡片点击全部删除/提交
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/cards_all_operation
 */
export declare namespace CardsAllOperation {
  type Request = {
    room_id: string; // 房间id
    operation_type: QuickChatCardsOperation; // 操作类型
    card_info_list?: QuickChatCardInfo[]; // 选中卡片
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    operation_fail_list?: OperationFailed[];
  };
}
