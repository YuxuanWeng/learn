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
 * @description 导出成交审批
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/history/export
 */
export declare namespace ReceiptDealApprovalHistoryExport {
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
    count?: number;
    export_after?: string;
    flag_printed?: boolean; // 是否打印
    product_market_list?: ProductMarket[]; // 台子+市场
    sort_method?: ApprovalSortingMethod; // 排序字段
    flag_search_child?: boolean; // 是否只查询子成交单
  };

  type Response = {
    base_response: BaseResponse;
    data?: string[];
    export_after?: string; // 请求下一页使用，如果为空则已无更多数据
  };
}
