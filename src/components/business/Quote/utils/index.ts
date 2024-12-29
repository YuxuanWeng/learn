import { Side } from '@fepkg/services/types/enum';
import { Intention } from '../types';

const CHI_PERIOD_PRICE_REGEX = /^\d{0,3}。$/;
/** 报价价格校验正则，0-999.9999 */
export const PRICE_REGEX = /^$|^(0|[1-9](\d?){1,2})(\.\d{0,4})?$/;
/** 报价利差校验正则，-999.9999-999.9999 */
export const SPREAD_REGEX = /^(-?)$|^(-?)(0|[1-9](\d?){1,2})(\.\d{0,4})?$/;
/** 结算金额校验正则，0-999_9999_9999.9999 */
export const SETTLEMENT_AMOUNT_REGEX = /^$|^(0|[1-9](\d?){1,11})(\.\d{0,4})?$/;
/** 报价量校验正则（万）,0-99_9999.99 */
export const VOLUME_TEN_THOUSAND_REGEX = /^$|^(0|[1-9](\d?){1,5})(\.\d{0,2})?$/;
/** 报价量校验正则（千万） */
export const VOLUME_TEN_MILLION_REGEX = /^\d{0,3}((\.)?|(\.\d{0,5}))?$/;

export const IntentionMap = {
  [Side.SideBid]: ['BID', 'B', 'BI'],
  [Side.SideOfr]: ['OFR', 'O', 'OF']
};

/** 是否为意向价 */
export const isIntention = (side?: Side, val?: string): val is Intention => {
  return Boolean(val && side && IntentionMap[side].includes(val));
};

/** 允许在价格的小数点位置输入中文句号，将中文句号替换为英文'.' */
export const replacePriceChiPeriod = (v: string): string => {
  /** 加一个中文'。'字符的特判, 期望在小数点位置输入中文句号时当作英文'.'处理 */
  if (!CHI_PERIOD_PRICE_REGEX.test(v)) return v;
  return v.replace('。', '.');
};

/** 检查是否为合法的报价量 */
export const checkVolumeValid = (val: string, regex = VOLUME_TEN_THOUSAND_REGEX): [boolean, string] => {
  if (regex.test(val)) {
    // if (val !== '' && Number(val) > 999999.99) {
    //   val = '999999.99';
    // }
    return [true, replacePriceChiPeriod(val)];
  }

  return [false, ''];
};

/** 检查是否为合法的报价价格 */
export const checkPriceValid = (val: string): [boolean, string] => {
  if (PRICE_REGEX.test(val)) {
    // if (val !== '' && Number(val) > 999.9999) {
    //   val = '999.9999';
    // }
    return [true, replacePriceChiPeriod(val)];
  }

  return [false, ''];
};

/** 检查是否为合法的利差价格 */
export const checkSpreadValid = (val: string): [boolean, string] => {
  if (SPREAD_REGEX.test(val)) {
    // if (val !== '' && Number(val) > 999.9999) {
    //   val = '999.9999';
    // }
    return [true, replacePriceChiPeriod(val)];
  }

  return [false, ''];
};

/** 检查是否为合法的结算金额价格 */
export const checkSettlementAmountValid = (val: string): [boolean, string] => {
  if (SETTLEMENT_AMOUNT_REGEX.test(val)) {
    return [true, replacePriceChiPeriod(val)];
  }

  return [false, ''];
};
