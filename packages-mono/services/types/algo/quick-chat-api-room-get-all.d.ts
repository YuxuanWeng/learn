import type { BaseResponse, QuickChatCardInfo, QuickChatRoom } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 获取房间全量数据
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/room_get_all
 */
export declare namespace RoomGetAll {
  type Request = {
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    rooms?: QuickChatRoom[]; // 房间信息
    cards?: QuickChatCardInfo[]; // 卡片信息
  };
}
