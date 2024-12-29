import type { BaseResponse } from '../common';

/**
 * @description 计算器
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/mul_calculate
 */
export declare namespace BaseDataMulCalculate {
  type Request = {
    item_list?: CalculateItem[];
    simple_validation?: boolean; // 为true时不返回除结算日相关的报错信息
  };

  type Response = {
    status_code: number;
    status_msg: string;
    result_list?: CalculateResult[];
    base_response?: BaseResponse;
  };

  export type CalculateItem = {
    bond_id: string; // 债券ID
    settlement_date: string; // 结算日期，毫秒时间戳
    yield_to_execution?: number; // 行权收益率
    yield?: number; // 到期收益率
    spread?: number; // 利差
    predict_rate?: number; // 基准利率
    clean_price?: number; // 净价
    full_price?: number; // 全价
    notional?: number; // 券面总额
    return_point?: number; // 返点
  };

  export type CalculateResult = {
    bond_id: string; // 债券ID
    bond_key: string; // 债券标识
    listed_market: string; // 发行市场
    settlement_date?: string; // 结算日期，毫秒时间戳
    accrued_days?: number; // 计息天数
    accrued_amount?: number; // 应计利息
    maturity_date?: string; // 兑付日，毫秒时间戳
    execution_date?: string; // 行权日，毫秒时间戳
    clean_price?: number; // 净价
    full_price?: number; // 全价
    yield_to_execution?: number; // 行权收益率
    yield?: number; // 到期收益率
    macaulay_duration?: number; // 麦氏久期
    modified_duration?: number; // 修正久期
    pvbp?: number; // 基点价值
    convexity?: number; // 凸性
    settlement_amount?: number; // 结算金额
    spread?: number; // 利差
    return_point?: number; // 返点
    predict_rate?: number; // 基准利率
    succeeded: boolean;
    error_msg: string;
    error_code: string;
  };
}
