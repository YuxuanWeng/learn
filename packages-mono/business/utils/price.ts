import { SERVER_NIL } from '@fepkg/common/constants';
import { floor } from 'lodash-es';
import { NEW_SERVER_NIL } from '../constants';

/** 计算价格小数位 */
export const transformPriceContent = (price: number) => {
  let priceValue = '';
  const suffix = price.toString().split('.')[1];
  let suffixVal: string | undefined;
  if (!suffix?.length) suffixVal = '.00';
  else if (suffix.length == 1) suffixVal = '0';

  if (price < 0) {
    priceValue = '--';
  } else if (!suffixVal) {
    // 向下取整4位小数
    priceValue += floor(price, 4).toString();
  } else {
    priceValue = price + suffixVal;
  }
  return priceValue;
};

export const formatNumber2ServerNil = (
  params: Record<string, any>,
  keys = ['yield', 'spread', 'clean_price', 'return_point']
) => {
  const keySet = new Set(keys);
  for (const key of Object.keys(params)) {
    // 清空价格相关的值时, 给后端传入默认空值(将老的SERVER_NIL转为新NEW_SERVER_NIL)
    if (keySet.has(key) && (params[key] === undefined || params[key] === SERVER_NIL)) {
      params[key] = NEW_SERVER_NIL;
    }
  }
};

/** 格式化价格展示内容
 * - 传入的 price 为 undefined 或小于 0，直接展示为 placeholder，当 placeholder 为 null，展示 ''
 * - 传入的 price === 0 时，展示为 placeholder，或展示为 0 且继续补 0
 * - 不满 x 位小数的，补 x 位 0
 * - 超过 x 位小数的，截取前 x 位（不是向上，向下去整，是直接截取，如：3.0000_567 -> 3.0000）
 */
export const formatPriceContent = (
  /** 价格 */
  price?: number,
  /** 保留几位小数，默认为 4 */
  decimal = 4,
  /** options */
  options?: {
    /** 是否支持负数，默认为 false，即当 price 为负数时，展示 placeholder */
    negative?: boolean;
    /** 是否支持 0，默认为 false，即当 price 为 0 时，展示 placeholder */
    zero?: boolean;
    /** 占位符，默认为 '--' */
    placeholder?: string | null;
  }
) => {
  const { negative = false, zero = false, placeholder = '--' } = options ?? {};

  if (price == undefined || Number.isNaN(Number(price))) {
    return placeholder || '';
  }

  if (price < 0) {
    if (!negative) return placeholder || '';
  }

  if (price === 0) {
    if (!zero) return placeholder || '';
    return price.toFixed(decimal);
  }

  const multiplier = 10 ** decimal;
  const fixed = Math.floor(Math.abs(price) * multiplier) / multiplier;
  const res = price < 0 ? -fixed : fixed;

  return res.toFixed(decimal);
};
