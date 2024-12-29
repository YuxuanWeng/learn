import type { BaseResponse } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 获取快聊房间已读信息
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/room_read_status_get
 */
export declare namespace RoomReadStatusGet {
  type Request = {
    product_type: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    last_unread_room_id?: string;
    red_dot_status: boolean; // 红点状态 true有红点，false没红点
  };
}
