import type {
  ApprovalSortingMethod,
  BaseResponse,
  RangeTime,
  ReceiptDealApproval,
  TableRelatedDealApprovalFilter
} from '../common';
import { AdvancedApprovalType, ListedMarket, ProductMarket, ProductType, ReceiptDealStatus } from '../enum';

/**
 * @description 获取审批列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/approval/search
 */
export declare namespace ReceiptDealApprovalSearch {
  type Request = {
    /** @deprecated */
    product_type?: ProductType; // deprecated
    /** @deprecated */
    listed_market_list?: ListedMarket[]; // deprecated
    handled?: boolean;
    status_list?: ReceiptDealStatus[];
    flag_urgent?: boolean;
    is_advanced_approval?: boolean;
    type_list?: AdvancedApprovalType[]; // 高级审核类型
    traded_date_range: RangeTime; // 日期范围，时间戳
    filter?: TableRelatedDealApprovalFilter;
    offset: number;
    count: number;
    flag_history_pass?: boolean; // 历史是否有通过
    product_market_list?: ProductMarket[]; // 台子+市场
    flag_printed?: boolean; // 是否打印
    sort_method?: ApprovalSortingMethod; // 排序字段
    flag_search_child?: boolean; // 是否只查询子成交单
  };

  type Response = {
    base_response: BaseResponse;
    receipt_deal_list?: ReceiptDealApproval[];
    total?: number;
    bridge_merge_total?: number;
    /** @deprecated */
    cur_role?: string; // deprecated
    cur_role_list?: string[];
  };
}
