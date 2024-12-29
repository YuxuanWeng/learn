import type { ApprovalSortingMethod, BaseResponse, RangeTime, TableRelatedDealApprovalFilter } from '../common';
import {
  BrokerageType,
  ListedMarket,
  ProductMarket,
  ProductType,
  ReceiptDealStatus,
  ReceiptDealTradeInstBrokerageComment
} from '../enum';

/**
 * @description 获取成交审批历史是否需要更新
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/history/check_update
 */
export declare namespace ReceiptDealApprovalHistoryCheckUpdate {
  type Request = {
    /** @deprecated */
    product_type?: ProductType; // deprecated
    /** @deprecated */
    listed_market_list?: ListedMarket[]; // deprecated
    status_list?: ReceiptDealStatus[];
    is_nc?: boolean;
    brokerage_type_list?: BrokerageType[];
    brokerage_comment_list?: ReceiptDealTradeInstBrokerageComment[];
    traded_date_range: RangeTime; // 日期范围，时间戳
    filter?: TableRelatedDealApprovalFilter;
    flag_printed?: boolean; // 是否打印
    start_timestamp: string;
    flag_history_pass?: boolean; // 历史是否有通过
    product_market_list?: ProductMarket[]; // 台子+市场
    sort_method?: ApprovalSortingMethod; // 排序字段
    flag_search_child?: boolean; // 是否只查询子成交单
  };

  type Response = {
    base_response: BaseResponse;
    need_update: boolean;
    filter_total: number; // 筛选项过滤后的total, 与 start_timestamp 无关
  };
}
