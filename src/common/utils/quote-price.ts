import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { Number2LimitedStringOption, noNil, number2LimitedString, padDecimal } from '@fepkg/common/utils/utils';
import { FiccBondBasic, QuoteInsert, QuoteLite } from '@fepkg/services/types/common';
import { BondQuoteType, MktType, Side } from '@fepkg/services/types/enum';
import { ceil, cloneDeep, floor, intersection, isEqual, isNaN, isString, isUndefined, pick } from 'lodash-es';
import {
  ComparableQuote,
  OperType,
  PriceTypeProps,
  QuotePriceType,
  QuoteTypeKeyEnum,
  allPriceTypes,
  priceTypes
} from '@/components/Quote/types';
import { PingJiaFanYield, side2Uppercase } from '@/components/Quote/utils';
import { IntentionField } from '@/pages/Quote/SingleQuote/constants';
import { isNumberNil } from './quote';

type PingJiaFanCol = 'quote_type' | 'flag_rebate' | 'return_point' | 'quote_price';

type FormattedEstimationOption = Number2LimitedStringOption & {
  decimal?: number;
};

const formatEsti = (val: number | string | undefined, option: FormattedEstimationOption) => {
  if (isNumberNil(val)) return void 0;
  const n = parseFloat(String(val));
  if (Number.isNaN(n)) return void 0;
  if ('noZeroAfterDecimalIndex' in option) return number2LimitedString(n, -1, option.decimal!, option);
  return padDecimal(n.toFixed(option.decimal), option.decimal);
};

const printEsti = (arr: (number | string | undefined)[], option: FormattedEstimationOption) => {
  return arr
    .filter(v => !isNumberNil(v))
    .map(v => formatEsti(v, option))
    .join(' | ');
};

/** 获取格式化后的债/证估值 */
export const getFormattedEstimation = (bond?: FiccBondBasic | null, option?: FormattedEstimationOption) => {
  option = { decimal: 4, ...option };
  if (!bond) return void 0;
  const hasOpt = hasOption(bond);
  const ytmArr = hasOpt ? [bond?.val_yield_exe, bond?.val_yield_mat] : [bond?.val_yield_mat];
  const cleanArr = hasOpt ? [bond?.val_clean_price_exe, bond?.val_clean_price_mat] : [bond?.val_clean_price_mat];

  return { yield: printEsti(ytmArr, option), clean_price: printEsti(cleanArr, option) };
};

export const isNotIntentional = (mkt_type?: MktType) => {
  return mkt_type !== MktType.IntentionalDebt;
};

export const getQuoteTypeCfg = (quote_type?: BondQuoteType, is_exercise?: boolean) => {
  if (!quote_type) return null;
  const cfg = allPriceTypes.find(t => t.value === quote_type);
  if (!cfg) return null;
  if (cfg.value === BondQuoteType.Yield && is_exercise) {
    return { ...cfg, key: 'yield_to_execution' };
  }
  return cfg;
};

export const omitPriceIntent = (type: OperType, price: Partial<QuoteInsert>) => {
  const clone = { ...price };
  for (const [k, v] of Object.entries(clone)) {
    if (type.toUpperCase().startsWith(String(v)) && v !== '') {
      delete clone[k];
    }
  }
  return clone as QuoteInsert;
};

export const normalizePriceNumber = (price: Partial<QuoteInsert>) => {
  const clone = { ...price };
  const props = [...allPriceTypes.map(t => t.key), 'return_point', 'volume'];
  props
    .filter(p => isString(clone[p]))
    .forEach(p => {
      const n = parseFloat(clone[p]);
      if (!isNaN(n)) clone[p] = n;
    });
  if (clone.volume === 0) clone.volume = SERVER_NIL;
  return clone;
};

export const normalizePrice = (type: OperType, price: Partial<QuoteInsert>) => {
  const clone = omitPriceIntent(type, price);
  return normalizePriceNumber(clone);
};

export const getCleanOriginalPrice = price => {
  const clone = { ...price };
  // eslint-disable-next-line no-return-assign
  if (clone.flag_intention) for (const t of PriceTypeProps) clone[t] = SERVER_NIL;
  if (clone.flag_intention || !clone.flag_rebate) delete clone.return_point;
  const props = [...allPriceTypes.map(t => t.key), 'return_point', 'volume'];
  for (const p of props) {
    if (clone[p] === -1) delete clone[p];
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return clone;
};

export const isPriceEqual = (p1: any, p2: any) => {
  const p1n = getCleanOriginalPrice(noNil(p1, { keepFalse: true }));
  const p2n = getCleanOriginalPrice(noNil(p2, { keepFalse: true }));
  return isEqual(normalizePriceNumber(p1n), normalizePriceNumber(p2n));
};

export const isOperEqual = (type: OperType, p1: any, p2: any) => {
  return isEqual(normalizePrice(type, p1), normalizePrice(type, p2));
};

export const hasSomePrice = (price: QuotePriceType | Partial<QuoteInsert>) => {
  const clone = getCleanOriginalPrice(price);
  const props = priceTypes.map(t => t.key);
  return props.some(p => {
    const vlu = clone[p];
    return (!isNumberNil(vlu) || vlu === 0) && !/^(BI?D?|OF?R?)$/.test(vlu);
  });
};

export const isPingJiaFan = (quote?: Pick<Partial<QuoteInsert>, PingJiaFanCol>, defaultPrice?: number) => {
  const quotePrice = defaultPrice ?? quote?.quote_price;
  const isUndefinedPrice = isUndefined(quotePrice);

  return (
    quote?.flag_rebate &&
    (quote.return_point === SERVER_NIL || quote.return_point === 0) &&
    (isUndefinedPrice || (!isUndefinedPrice && (quotePrice === SERVER_NIL || quotePrice === 0)))
  );
};

export const hasValidPrice = (price: QuotePriceType | Partial<QuoteInsert>, includeIntent = true) => {
  let bool: boolean = hasSomePrice(price) || !isNumberNil(price.return_point) || !isNumberNil(price.volume);
  if (isPingJiaFan(pick(price, PingJiaFanYield) as Pick<QuoteLite, PingJiaFanCol>)) bool = true;
  else if (includeIntent) bool = bool || !!price.flag_intention;
  return bool;
};

export const getReadableYield = <T extends ComparableQuote>(quote: T) => {
  if (quote.quote_type !== BondQuoteType.Yield) return '--';
  if (isPingJiaFan(quote)) return '平价返';
  if (quote.flag_intention) return side2Uppercase(quote);
  let str = !isNumberNil(quote.quote_price) ? padDecimal(quote.quote_price) : '--';
  if (quote.flag_rebate) {
    str += `F${!isNumberNil(quote.return_point) ? padDecimal(quote.return_point) : '--'}`;
  }
  return str;
};

/** eg: 2.5308, 保留两位小数。 bid: 2.54, ofr: 2.53 */
export const getEstimation = (side: Side, value?: number, decimalLimit = 4) => {
  if (!value) return '';

  // 向上取整
  if (side === Side.SideBid) return ceil(value, decimalLimit).toString();

  // 向下取整
  if (side === Side.SideOfr) return floor(value, decimalLimit).toString();

  return '';
};

/** 格式化估价内容 */
const formatValuation = (val?: number | string, decimalLimit = 4) => {
  if (isNumberNil(val)) return void 0;
  const n = parseFloat(String(val));
  if (Number.isNaN(n)) return void 0;
  return padDecimal(n.toFixed(decimalLimit), decimalLimit);
};

/** 转换为估价展示的内容 */
export const transform2ValContent = (bond?: FiccBondBasic, decimalDigit?: number) => {
  let res: string | undefined;
  if (hasOption(bond)) {
    const yArr = [bond?.val_yield_exe, bond?.val_yield_mat].filter(v => !isNumberNil(v));
    const mArr = [bond?.val_clean_price_exe, bond?.val_clean_price_mat].filter(v => !isNumberNil(v));
    res = (yArr.length ? yArr : mArr).map(v => formatValuation(v, decimalDigit)).join(' | ');
  } else if (!isNumberNil(bond?.val_yield_mat)) {
    res = formatValuation(bond?.val_yield_mat, decimalDigit);
  } else if (!isNumberNil(bond?.val_clean_price_mat)) {
    res = formatValuation(bond?.val_clean_price_mat, decimalDigit);
  }

  if (Number(res) === 0) res = '';
  return res;
};

/**
 * 将price转换为接口入参格式
 * @param price string 价格
 * @param quote_type BondQuoteType 报价类型
 * @returns object {[BondQuoteType]: number}
 */
export const transformPrice = (price?: string) => {
  if (!price || IntentionField.includes(price)) return { quote_price: SERVER_NIL };
  return { quote_price: Number(price) };
};

/** 判断报价价格是否为空，价格（收益率、净价）为 0 或空（包含价格值为 0 或空时，点亮 F，返点值为 0 或为空） */
export const isQuotePriceEmpty = (price?: { price?: number; quote_price?: number; flag_intention?: boolean }) => {
  const { quote_price, flag_intention } = price ?? {};

  if (!Number(quote_price) && !Number(price?.price)) return true;
  if (quote_price === SERVER_NIL && price?.price === SERVER_NIL) return true;
  if (flag_intention) return true;
  return false;
};
