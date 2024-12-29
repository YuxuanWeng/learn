import type { AutoQuoteQuickchatOptData, BaseResponse } from '../common';
import { AutoQuoteQuickchatOptType } from '../enum';

/**
 * @description 批量添加快聊操作(快聊使用)
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/mul_add_quick_chat_opt
 */
export declare namespace MulAddQuickChatOpt {
  type Request = {
    broker_chat_id: string; // broker 在quickchat中的id,可能是QMid也可能是QQ,邮箱格式
    trader_chat_id: string; // trader 在quickchat中的id,可能是QMid也可能是QQ,邮箱格式
    broker_idb_key?: string; // broker的idbKey
    trader_idb_key?: string; // trader的idbKey
    room_id?: string; // 房间id
    opt_data_list?: AutoQuoteQuickchatOptData[]; // 快聊卡片操作以后返回的信息
    source?: AutoQuoteQuickchatOptType; // 来源 1:点确认;2:移入回收站
  };

  type Response = {
    base_response: BaseResponse;
  };
}
