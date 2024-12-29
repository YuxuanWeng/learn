import { SERVER_NIL } from '@fepkg/common/constants';
import { BondBenchmarkRate, FiccBondBasic, RestDayToWorkday } from '@fepkg/services/types/common';
import { isUndefined } from 'lodash-es';

/** 获取「休几」的数量 */
export const getRestDayNum = (data?: RestDayToWorkday) => {
  if (!data?.days_cib && !data?.days_sse) return '';
  // 如果银行间休几 === 交易所休几，就取同一个值。如果不同，就取 x/y
  // 注：深交所和上交所的值一定是一样的！
  if (data.days_cib === data.days_sse) return `${data.days_cib}`;
  if (data.days_cib && data.days_sse && data.days_cib !== data.days_sse) return `${data.days_cib}/${data.days_sse}`;
  return (data.days_cib || data.days_sse)?.toString() ?? '';
};

/**  是否为空值（后端空值时有可能返回 -1 或 undefined) */
const isEmptyValue = (value?: number): value is undefined => {
  return isUndefined(value) || value === SERVER_NIL;
};

/** 获取票面利率 */
export const getCouponRateCurrent = (bond?: FiccBondBasic) => {
  if (!bond) return '';
  // 若票面利率为空，发行收益为空，则展示为空
  if (isEmptyValue(bond.coupon_rate_current) && isEmptyValue(bond?.issue_rate)) return '';

  let couponRateCurrent = 0;

  // 若票面利率不为空
  if (!isEmptyValue(bond.coupon_rate_current)) {
    // 若票面利率大于 0；或票面利率为 0，发行收益为空，则展示票面利率
    if (bond.coupon_rate_current > 0 || (bond.coupon_rate_current === 0 && isEmptyValue(bond?.issue_rate))) {
      couponRateCurrent = bond.coupon_rate_current;
    } // 若票面利率为 0，发行收益不为空，则展示发行收益
    else if (bond.coupon_rate_current === 0 && !isEmptyValue(bond.issue_rate)) {
      couponRateCurrent = bond.issue_rate;
    }
  } // 若票面利率为空，发行收益不为空，则展示发行收益
  else if (isEmptyValue(bond.coupon_rate_current) && !isEmptyValue(bond?.issue_rate)) {
    couponRateCurrent = bond.issue_rate;
  }

  if (couponRateCurrent === 0) return '';

  return `${couponRateCurrent.toFixed(4)}%`;
};

/** 利率方式Map */
export const couponTypeMap = {
  DSC: '贴现',
  FRB: '固定利率',
  FRN: '浮动利率',
  PAM: '利随本清',
  ZRO: '零息',
  STR: '可分离',
  RNG: 'Range'
};

/** 转换利率方式 */
export const transformCouponType = (couponType?: string, benchmarkRate?: BondBenchmarkRate) => {
  if (couponType === 'FRN') return benchmarkRate?.name ?? '';
  return (couponTypeMap[couponType ?? ''] ?? '') as string;
};

/** 是否是浮动利息 */
export const isFR = (bond?: Partial<FiccBondBasic>) => {
  if (!bond || !('is_fixed_rate' in bond)) return false;
  return !bond.is_fixed_rate;
};
