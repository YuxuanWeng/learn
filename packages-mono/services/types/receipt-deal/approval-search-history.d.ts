import type {
  ApprovalSortingMethod,
  BaseResponse,
  RangeTime,
  ReceiptDealApproval,
  TableRelatedDealApprovalFilter
} from '../common';
import {
  BrokerageType,
  ListedMarket,
  ProductMarket,
  ProductType,
  ReceiptDealStatus,
  ReceiptDealTradeInstBrokerageComment
} from '../enum';

/**
 * @description 获取历史审批
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/search_history
 */
export declare namespace ReceiptDealApprovalSearchHistory {
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
    offset: number;
    count: number;
    flag_printed?: boolean; // 是否打印
    flag_history_pass?: boolean; // 历史是否有通过
    product_market_list?: ProductMarket[]; // 台子+市场
    sort_method?: ApprovalSortingMethod; // 排序字段
    flag_search_child?: boolean; // 是否只查询子成交单
  };

  type Response = {
    base_response: BaseResponse;
    receipt_deal_list?: ReceiptDealApproval[];
    total?: number;
    bridge_merge_total?: number;
  };
}
