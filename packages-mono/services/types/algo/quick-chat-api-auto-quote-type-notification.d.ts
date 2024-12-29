import type { BaseResponse } from '../common';
import { AutoQuoteCountDownType } from '../enum';

/**
 * @description 倒计时状态变更通知
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/auto_quote_type_notification
 */
export declare namespace GetAutoQuoteTypeNotification {
  type Request = {
    broker_qm_id: string; // broker的qmid
    record_id: string; // 唯一id
    count_down_type: AutoQuoteCountDownType; // 当前倒计时状态
  };

  type Response = {
    base_response: BaseResponse;
  };
}
