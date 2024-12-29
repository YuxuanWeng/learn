import type { BaseResponse, ReceiptDealDetail } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据桥机构筛选条件查询成交单明细
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/detail/search_by_bridge_inst
 */
export declare namespace ReceiptDealDetailSearchByBridgeInst {
  type Request = {
    bridge_inst_id: string; // 桥机构id,必填
    product_type: ProductType; // 台子限制
    internal_code?: string; // 内码
    bond_key_market?: string; // 债券唯一标识
    price?: number; // 价格
    deal_date?: string; // 成交日, 所选择日期0点的时间戳
    traded_date?: string; // 交易日, 所选择日期0点的时间戳
    my_bridge?: boolean; // 我的桥
    intelligence_sorting?: boolean; // 智能排序
  };

  type Response = {
    base_response?: BaseResponse;
    today_receipt_deals?: ReceiptDealDetail[];
    tomorrow_receipt_deals?: ReceiptDealDetail[];
    other_receipt_deals?: ReceiptDealDetail[];
  };
}
