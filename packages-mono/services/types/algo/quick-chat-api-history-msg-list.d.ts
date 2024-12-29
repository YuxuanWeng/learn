import type { BaseResponse, QQMsg } from '../common';

/**
 * @description 拉取历史消息
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/history_msg_list
 */
export declare namespace HistoryMsgList {
  type Request = {
    room_id: string; // 房间id
    after_timestamp: string; // 上一批消息最后一条的时间戳
    count: number; // 数量
  };

  type Response = {
    base_response: BaseResponse;
    msg_list?: QQMsg[];
    has_next: boolean; // 是否有下一页
  };
}
