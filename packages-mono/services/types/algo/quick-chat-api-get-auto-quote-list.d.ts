import type { AutoQuoteRecord, BaseResponse } from '../common';
import { AutoQuoteSelectType } from '../enum';

/**
 * @description 获取自动挂单页面数据
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/get_auto_quote_list
 */
export declare namespace GetAutoQuoteList {
  type Request = {
    broker_qm_id: string; // broker的qmid
    count?: number; // 数量 不传默认10
    offset?: number; // 偏移量 不传默认0
    type?: AutoQuoteSelectType; // 类型 不传默认全部
    start_time?: string; // 开始时间 格式:2022-12-01 不传默认当天
    end_time?: string; // 结束时间 格式:2022-12-01 不传默认当天
    code_market?: string; // 券码
    trader_idb_key?: string; // trader的idb_key
    ws_client_id?: string; // ws下发的client_id，非前端自己的
  };

  type Response = {
    base_response: BaseResponse;
    record_list?: AutoQuoteRecord[];
    total: number; // 总数
  };
}
