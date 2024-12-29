import type { BaseResponse, ReceiptDealDetail } from '../common';
import { BondCategory, BondShortName, ListedMarket, MktType, ProductType } from '../enum';

/**
 * @description 根据筛选条件查询成交单明细
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/detail/search
 */
export declare namespace ReceiptDealDetailSearch {
  type Request = {
    intelligence_sorting?: boolean; // 智能排序
    only_display_today?: boolean; // 仅展示当日成交
    include_history?: boolean; // 是否展示历史
    is_lack_of_bridge?: boolean; // 是否缺桥
    mkt_type?: MktType; // 市场类型, 意向债/二级债
    listed_market?: ListedMarket[]; // 交易场所, 银行间/上交所/深交所
    internal_code?: string; // 内码
    bond_key_market?: string; // 债券唯一标识
    price?: number; // 价格
    inst_id?: string; // 机构id
    trader_id?: string; // 交易员id
    bond_short_name_list?: BondShortName[]; // 债券类型条件中的第一部分——国开/口行/农发
    bond_category?: BondCategory[]; // //债券类型条件中的第二部分——国债/央票/地方债
    traded_date?: string; // 交易日, 所选择日期0点的时间戳
    product_type: ProductType; // 台子限制
    search_after?: string; // 分页参数, 查询起始点，首次查询则不传；
    count?: number; // 分页参数, 由于并单逻辑、和交易员展示逻辑的存在，返回条数可能会多于count值
  };

  type Response = {
    base_response?: BaseResponse;
    receipt_deal_details?: ReceiptDealDetail[];
    next_search_after?: string;
  };
}
