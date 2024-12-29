import type { DealRecord } from '../common';
import { ProductType } from '../enum';

/**
 * @description 查询成交记录
 * @method POST
 * @url /ws
 */
export declare namespace LocalServerDealRecordList {
  type Request = {
    deal_time?: string; // 成交时间
    broker_id_list?: string[];
    product_type?: ProductType;
  };

  type Response = {
    deal_record_list?: DealRecord[];
  };
}
