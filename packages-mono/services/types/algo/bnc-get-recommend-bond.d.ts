import type { BaseResponse, SortingMethod } from '../common';
import { BondSubCategory, CouponRateType, RegionType, TimeToMaturityType } from '../enum';

/**
 * @description 获取地方债推荐
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/get_recommend_bond
 */
export declare namespace BncGetRecommendBond {
  type Request = {
    broker_id: string;
    region_type_list?: RegionType[]; // 地区
    coupon_rate_type_list?: CouponRateType[]; // 票面利率
    time_to_maturity_type_list?: TimeToMaturityType[]; // 剩余期限
    bond_sub_category_list?: BondSubCategory[]; // 地方债分类 一般/专项
    recommend_count: number; // 可推荐人数
    code_market: string; // 债券
    offset: number;
    count: number;
    sorting_method: SortingMethod; // 排序
    trader_id?: string;
    max_coupon_rate?: number; // 最大票面利率
    min_coupon_rate?: number; // 最小票面利率
    province_code_list?: string[]; // 地区
    key_market?: string; // 债券
  };

  type Response = {
    base_response: BaseResponse;
    list?: BncRecommendBond[];
    total: number;
  };

  export type BncRecommendBond = {
    time_to_maturity: string; // 剩余期限
    code_market: string;
    short_name: string; // 债券简称
    ofr_price: string; // 债券盘口ofr价格
    ofr_vol: string; // 债券盘口ofr量
    bid_price: string; // 债券盘口bid价格
    bid_vol: string; // 债券盘口bid量
    coupon_rate: number; // 票面利率
    val_yield: string; // 估值
    fund_objective_category: string; // 地方债大类
    bond_sub_category: BondSubCategory; // 地方债分类
    recommend_count: number; // 可推荐人数
    send_count: number; // 已推荐人数
    latest_deal_side: string; // 最近一次成交的类型 tkn/gvn/trd
    latest_deal_price: number; // 最近一次成交的价格
    province: string; // 地区
    internal_bid: boolean; // bid单是否为内部报价 true为是，false不是
    internal_ofr: boolean; // ofr单是否为内部报价 true为是，false不是
    internal_deal: boolean; // 成交是否为内部报价
    rest_day_to_workday: number; // 休几
    quote_copy?: string; // 报价复制
    key_market: string;
  };
}
