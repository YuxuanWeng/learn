import type { BaseResponse, InputFilter, RangeTime, ReceiptDeal } from '../common';
import { DealDateType, ProductType, ReceiptDealSortedField, ReceiptDealStatus } from '../enum';

/**
 * @description 成交单查询 轮询接口
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/search
 */
export declare namespace ReceiptDealSearch {
  type Request = {
    table_related_filter?: ReceiptDealTableRelatedFilter;
    receipt_deal_input_filter?: ReceiptDealInputFilter;
    input_filter?: InputFilter;
    sorting_method?: ReceiptDealSortingMethod;
    product_type?: ProductType;
    offset: number;
    count: number;
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_info?: ReceiptDeal[];
    total?: number;
    bridge_merge_total?: number;
  };

  export type ReceiptDealTableRelatedFilter = {
    receipt_deal_status?: ReceiptDealStatus[]; // 单据状态 状态 传枚举数组
    flag_internal?: boolean; // 内部
    flag_bridge?: boolean; // 过桥
    flag_self?: boolean; // 本人成交
    date_range?: RangeTime; // 日期范围
    date_type?: DealDateType; // 筛选日期类型 (交易日/结算日/交割日)
    flag_urge?: boolean; // 催单
  };

  export type ReceiptDealInputFilter = {
    order_no?: string; // 订单号
    bridge_code?: string; // 过桥码
    seq_number?: string; // 序列号
    internal_code?: string; // 内码
  };

  export type ReceiptDealSortingMethod = {
    sorted_field: ReceiptDealSortedField; // 排序字段名
    is_desc: boolean; // 是否倒序
  };
}
