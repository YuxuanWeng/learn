import type { BaseResponse } from '../common';
import { BdsProductType, QuickChatRoomReadType } from '../enum';

/**
 * @description 通知后端已读
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/room_read
 */
export declare namespace RoomRead {
  type Request = {
    room_id?: string;
    room_read_type: QuickChatRoomReadType;
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
