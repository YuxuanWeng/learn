import type { BaseResponse } from '../common';
import { AutoQuoteOptType } from '../enum';

/**
 * @description 自动挂单全量操作
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/update_auto_quote_record_all
 */
export declare namespace UpdateAutoQuoteRecordAll {
  type Request = {
    broker_qm_id: string; // broker的qmid
    opt_type: AutoQuoteOptType; // 操作类型
  };

  type Response = {
    base_response: BaseResponse;
  };
}
