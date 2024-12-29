import type {
  BaseResponse,
  InputFilter,
  ReceiptDeal,
  ReceiptDealInputFilter,
  ReceiptDealSortingMethod,
  ReceiptDealTableRelatedFilter
} from '../common';
import { ProductType } from '../enum';

/**
 * @description 成交单查询 轮询接口
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/search_v2
 */
export declare namespace ReceiptDealSearchV2 {
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
    parent_child_deal_list?: ParentChildDeal[];
    total?: number;
    bridge_merge_total?: number;
  };

  export type ParentChildDeal = {
    parent_deal_id: string; // 父单成交ID
    bridge_code?: string; // 过桥码
    receipt_deal_info_list?: ReceiptDeal[]; // 子成交单列表
  };
}
