import type { BaseResponse, DealDetail } from '../common';
import { BondCategory, BondShortName, ListedMarket, MktType } from '../enum';

/**
 * @description 根据筛选条件筛选成交明细
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/detail/list
 */
export declare namespace DealDetailList {
  type Request = {
    show_history: boolean; // 是否展示历史
    is_lack_of_bridge: boolean; // 是否缺桥
    bond_key_market?: string; // 债券唯一标识
    bond_category_list?: BondCategory[]; // 券种
    bond_short_name_list?: BondShortName[]; // 国开，口发，农发
    listed_market_list?: ListedMarket[]; // 交易场所
    inst_id?: string; // 机构id
    trader_id?: string; // 交易员id
    price?: number; // 价格
    traded_date?: string; // 交易日期
    mkt_type?: MktType; // 市场类型，二级和意向
    intelligence_sorting?: boolean; // 智能排序
    simplified?: boolean; // 是否简化返回值
  };

  type Response = {
    base_response?: BaseResponse;
    deal_detail_list?: DealDetail[];
    deal_id_list?: string[];
  };
}
