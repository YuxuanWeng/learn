import type { BaseResponse } from '../common';
import { AutoQuoteOptType } from '../enum';

/**
 * @description 自动挂单操作
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/update_auto_quote_record
 */
export declare namespace UpdateAutoQuoteRecord {
  type Request = {
    broker_qm_id: string; // broker的qmid
    opt_type: AutoQuoteOptType; // 操作类型
    record_id: string; // 唯一id
  };

  type Response = {
    base_response: BaseResponse;
  };
}
