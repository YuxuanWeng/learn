import type { BaseResponse, BncTraderRecommendRule } from '../common';
import {
  BondIssueDayType,
  BondMarketType,
  BondSubCategory,
  CouponRateType,
  TimeToMaturityType,
  TimeToMaturityUnit
} from '../enum';

/**
 * @description 更新地方债规则
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/update_trader_recommend_rule
 */
export declare namespace BncUpdateTraderRecommendRule {
  type Request = {
    rule_id: string; // 规则唯一ID
    name?: string; // 模板名称
    min_price?: number; // 最小收益率 * 10^4
    max_price?: number; // 最大收益率 * 10^4
    price_deviation?: number; // 偏离估值，单位BP
    bond_issue_day_type_list?: BondIssueDayType[]; // 发行日
    bond_market_type_list?: BondMarketType[]; // 市场类型
    bond_sub_category_list?: BondSubCategory[]; // 债券子类别 一般/专项
    min_time_to_maturity?: number; // 最小剩余期限
    max_time_to_maturity?: number; // 最大剩余期限
    time_to_maturity_unit?: TimeToMaturityUnit; // 剩余期限单位 （年， 月，日）
    time_to_maturity_type_list?: TimeToMaturityType[]; // 剩余期限
    coupon_rate_type_list?: CouponRateType[]; // 债券利率种类
    province_code_list?: string[]; // 省份
    issue_year_list?: number[]; // 发行年份
    config_desc?: string; // 配置描述
    trader_id: string;
    max_coupon_rate?: number; // 最大票面利率
    min_coupon_rate?: number; // 最小票面利率
  };

  type Response = {
    base_response: BaseResponse;
    rule: BncTraderRecommendRule;
  };
}
