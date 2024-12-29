import type { BaseResponse, QuickChatCardInfo } from '../common';
import { BdsProductType, QuickChatRecycleBinOperation } from '../enum';

/**
 * @description 回收站点击删除/提交
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/recycle_bin_operation
 */
export declare namespace RecycleBinOperation {
  type Request = {
    operation_type: QuickChatRecycleBinOperation; // 操作类型
    room_id: string; // 房间id
    card_info: QuickChatCardInfo; // 当前卡片信息
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
