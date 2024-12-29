import type { BaseResponse, QuickChatQuoteDealLog } from '../common';

/**
 * @description 获取交易员当日已完成交易列表
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/get_today_deal_log
 */
export declare namespace GetTodayDealLog {
  type Request = {
    trader_id: string; // 交易员id
    product_type: string;
  };

  type Response = {
    base_response: BaseResponse;
    deal_log_list?: QuickChatQuoteDealLog[];
  };
}
