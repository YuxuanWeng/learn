import type { BaseResponse, OperationFailed, QuickChatCardInfo } from '../common';
import { BdsProductType, QuickChatRecycleBinOperation } from '../enum';

/**
 * @description 回收站点击全部删除/提交
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/recycle_bin_all_operation
 */
export declare namespace RecycleBinAllOperation {
  type Request = {
    operation_type: QuickChatRecycleBinOperation; // 操作类型
    room_id: string; // 房间id
    card_info_list?: QuickChatCardInfo[]; // 选中卡片
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
    operation_fail_list?: OperationFailed[];
  };
}
