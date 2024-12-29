import type { BaseResponse, QuickChatQuoteDealLog } from '../common';

/**
 * @description 获取交易员最新一次操作
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/get_latest_operation_log
 */
export declare namespace GetLatestOperationLog {
  type Request = {
    trader_id: string; // 交易员id
    broker_id: string;
    product_type: string;
    key_market: string;
    dark: boolean; // 明暗盘;internal_flag
  };

  type Response = {
    base_response: BaseResponse;
    latest_operation_log: QuickChatQuoteDealLog;
  };
}
