import type { BaseResponse, QuickChatCardInfo, QuickChatHandicap } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 获取快聊卡片信息
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/cards_info_get
 */
export declare namespace CardsInfoGet {
  type Request = {
    room_id: string; // 房间id
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    handicap_info?: QuickChatHandicap[]; // 盘口信息
    card_info_list?: QuickChatCardInfo[]; // 快聊卡片信息
    red_dot_status: boolean; // 红点状态 true有红点，false没红点
  };
}
