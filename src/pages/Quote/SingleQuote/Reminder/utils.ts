import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { errorToString, fixFloatDecimal } from '@fepkg/common/utils';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import type { QuotePrice } from '@fepkg/services/types/bond-optimal-quote/get-optimal-price';
import { FiccBondBasic } from '@fepkg/services/types/common';
import { BondQuoteType, ProductType, Side } from '@fepkg/services/types/enum';
import { withCtx } from '@fepkg/trace';
import { context } from '@opentelemetry/api';
import { formatPrice } from '@/common/utils/copy';
import { logger } from '@/common/utils/logger';
import { queryClient } from '@/common/utils/query-client';
import { isPingJiaFan, isQuotePriceEmpty } from '@/common/utils/quote-price';
import {
  CalcPriceMap,
  CalcPriceQueryVar,
  EIPriceMap,
  getEiPriceMapKey,
  useCalcPriceQuery
} from '@/pages/Quote/SingleQuote/hooks/useCalcPriceQuery';
import { DblSideQuotePrice, useOptimalPriceQuery } from '@/pages/Quote/SingleQuote/hooks/useOptimalPriceQuery';
import { QuoteParamsType } from '../QuoteOper/QuoteOperProvider';
import { has, hasPrice } from '../utils';
import { showConfirmReminderModal } from './ConfirmModal';
import { DblSideInvertedInfo, InvertedInfo, QuoteReminder } from './types';

const formatYield = (price: Partial<QuotePrice>) => {
  if (price?.quote_type !== BondQuoteType.Yield) return '--';
  let res = hasPrice(price?.quote_price) ? formatPrice(price?.quote_price, 4) : '--';

  if (price?.flag_rebate) res += `F${hasPrice(price?.return_point) ? formatPrice(price.return_point, 4) : '--'}`;
  return res;
};

/** 转换为对价展示内容 */
const transform2Consideration = (price?: Partial<QuotePrice>) => {
  if (!has(price)) return '';
  const { quote_type, quote_price } = price;
  if (quote_type === BondQuoteType.Yield) return formatYield(price);
  if (quote_type === BondQuoteType.CleanPrice) return fixFloatDecimal(quote_price ?? 0, 4).toString();
  return '';
};

/**
 * 获取倒挂信息
 * @param side 判断方向
 * @param optimalPrice 该方向的最优报价
 */
export const getInvertedInfo = (side: Side, optimalPrice?: QuotePrice) => {
  const info: InvertedInfo = { inverted: false };

  // 如果另一个方向无最优报价，或最优报价为无价情况（意向价，平价返，无价加返点），不倒挂
  if (
    !has(optimalPrice) ||
    optimalPrice.flag_intention ||
    isPingJiaFan(optimalPrice) ||
    (!hasPrice(optimalPrice.yield) && optimalPrice?.flag_rebate)
  )
    return info;

  const priceContent = transform2Consideration(optimalPrice);

  // 如果最优价为收益率，或收益率 + 返点，则展示 「另一方向不能低于${收益率}${返点}」 -> 倒挂
  if (optimalPrice.quote_type === BondQuoteType.Yield) {
    info.inverted = true;

    // 对 ofr 方向，如果为 ofr 最优报价 X，则 bid 方向展示 「bid不能低于X」
    if (side === Side.SideOfr) info.min = priceContent;
    // 对 bid 方向，如果为 bid 最优报价 Y，则 ofr 方向展示 「ofr不能高于Y」
    else info.max = priceContent;
  } else if (optimalPrice.quote_type === BondQuoteType.CleanPrice) {
    info.inverted = true;

    // 对 ofr 方向，如果为 ofr 最优报价 X，则 bid 方向展示 「bid不能高于X」
    if (side === Side.SideOfr) info.max = priceContent;
    // 对 bid 方向，如果为 bid 最优报价 Y，则 ofr 方向展示 「ofr不能低于Y」
    else info.min = priceContent;
  }

  return info;
};

type PricesGap = {
  /** 报价类型 */
  quoteType?: BondQuoteType;
  /** 价格差值 */
  value?: number;
};

/** 判断两个报价的报价类型是否相同 */
const isPricesQuoteTypeEqual = (aPrice?: Partial<QuotePrice>, bPrice?: Partial<QuotePrice>) => {
  const isQuoteTypeEqual = aPrice?.quote_type === bPrice?.quote_type;

  switch (aPrice?.quote_type) {
    case BondQuoteType.Yield: {
      const isExerciseEqual = aPrice?.is_exercise === bPrice?.is_exercise;
      // 如果是收益率，还要看两个价格的行权到期是否一致
      return isQuoteTypeEqual && isExerciseEqual;
    }
    default:
      return isQuoteTypeEqual;
  }
};

/**
 * 比价两个报价的价格
 * @returns {PricesGap} 如果 PricesGap 有 value ，则说明能进行比较，即两个报价都有价格，并且报价类型相同，value 为 aPrice - bPrice
 */
export const comparePrice = (aPrice?: Partial<QuotePrice>, bPrice?: Partial<QuotePrice>, skipRebate = true) => {
  const gap: PricesGap = {};

  if (!(has(aPrice) && has(bPrice))) return gap;
  if (!isPricesQuoteTypeEqual(aPrice, bPrice)) return gap;

  switch (aPrice.quote_type) {
    case BondQuoteType.Yield:
      gap.quoteType = BondQuoteType.Yield;
      // 如果为收益率，如果当前报价或盘口带返点，则不进行比较
      if (skipRebate && (aPrice?.flag_rebate || bPrice?.flag_rebate)) return gap;

      // 如果同时存在收益率，可以比较
      if (hasPrice(aPrice?.yield) && hasPrice(bPrice?.yield)) {
        // bid 越小越优，ofr 相反
        gap.value = aPrice.yield - bPrice.yield;
      } else if (hasPrice(aPrice?.quote_price) && hasPrice(bPrice?.quote_price)) {
        // bid 越小越优，ofr 相反
        gap.value = aPrice.quote_price - bPrice.quote_price;
      }
      break;
    case BondQuoteType.CleanPrice:
      gap.quoteType = BondQuoteType.CleanPrice;
      // 如果同时存在净价，可以比较
      if (hasPrice(aPrice?.clean_price) && hasPrice(bPrice?.clean_price)) {
        // bid 越大越优，ofr 相反
        gap.value = fixFloatDecimal(aPrice.clean_price, 4) - fixFloatDecimal(bPrice.clean_price, 4); // 保留四位小数进行计算，避免精度问题
      } else if (hasPrice(aPrice?.quote_price) && hasPrice(bPrice?.quote_price)) {
        // bid 越大越优，ofr 相反
        gap.value = fixFloatDecimal(aPrice.quote_price, 4) - fixFloatDecimal(bPrice.quote_price, 4); // 保留四位小数进行计算，避免精度问题
      }
      break;
    default:
      break;
  }

  return gap;
};

/** 格式化经计算器后返回的净价（保留 4 位小数） */
const formatCalcCleanPrice = (calcCleanPrice?: number) => {
  return calcCleanPrice !== undefined ? fixFloatDecimal(calcCleanPrice, 4) : void 0;
};

/**
 * 检查单个方向报价是否倒挂
 * @param side 该方向
 * @param dblOptimalPrice 该债券的两个方向的最优报价
 * @param dblPrice 该债券的两个方向的报价
 * @param calcCleanPrice 该方向计算得出的净价
 */
export const checkSideInverted = (
  side: Side,
  dblOptimalPrice: DblSideQuotePrice,
  dblPrice: DblSideQuotePrice,
  calcCleanPrice?: number
) => {
  const info: DblSideInvertedInfo = { [Side.SideBid]: { inverted: false }, [Side.SideOfr]: { inverted: false } };

  /** 该方向的报价 */
  const price = side === Side.SideBid ? dblPrice[Side.SideBid] : dblPrice[Side.SideOfr];
  /** 另一个方向的最优报价 */
  const otrOptimalPrice = side === Side.SideBid ? dblOptimalPrice[Side.SideOfr] : dblOptimalPrice[Side.SideBid];

  // 如果本方向无报价，或价格（收益率、净价）为 0 或空（包含价格值为 0 或空时，点亮 F，反点值为 0 或为空）
  if (!has(price) || isQuotePriceEmpty(price)) return info;

  /** 该方向计算得出的净价 */
  const cleanPrice = formatCalcCleanPrice(calcCleanPrice);
  /** 另一个方向的最优净价 */
  const otrOptimalCleanPrice = formatCalcCleanPrice(otrOptimalPrice?.clean_price);

  // 如果有计算得出的净价，直接比较两者计算后的净价
  if (hasPrice(cleanPrice) && hasPrice(otrOptimalCleanPrice)) {
    if (side === Side.SideBid) {
      // 当该券当前 ofr 方向最优报价 X，bid 侧报价价格计算后得到的净价违反 「bid净价 < X计算后的净价」 时，倒挂
      info[Side.SideBid].inverted = !(cleanPrice - otrOptimalCleanPrice < 0);
    } else {
      // 当该券当前 bid 方向最优报价 Y，ofr 侧报价价格计算后得到的净价违反 「Y计算后的净价 < ofr净价」 时，倒挂
      info[Side.SideOfr].inverted = !(otrOptimalCleanPrice - cleanPrice < 0);
    }
  } else {
    // 如果没有计算得出的净价，则价格类型相同时，直接比较

    // 比较两个价格，如果能够直接比较，直接根据差值获取倒挂信息
    const gap = comparePrice(price, otrOptimalPrice);

    if (has(gap?.value)) {
      if (side === Side.SideBid) {
        if (gap?.quoteType === BondQuoteType.Yield) {
          // 如果同为收益率，违反 B > X 时（差值大于 0），倒挂
          info[Side.SideBid].inverted = !(gap.value > 0);
        } else if (gap?.quoteType === BondQuoteType.CleanPrice) {
          // 如果同为净价，违反 B < X 时（差值小于 0），倒挂
          info[Side.SideBid].inverted = !(gap.value < 0);
        }
      } else if (side === Side.SideOfr) {
        if (gap?.quoteType === BondQuoteType.Yield) {
          // 如果同为收益率，违反 O < Y 时（差值小于 0），倒挂
          info[Side.SideOfr].inverted = !(gap.value < 0);
        } else if (gap?.quoteType === BondQuoteType.CleanPrice) {
          // 如果同为净价，违反 O > Y 时（差值大于 0），倒挂
          info[Side.SideOfr].inverted = !(gap.value > 0);
        }
      }
    }
  }

  // 如果有倒挂，需要填充该方向的对价信息（使用另一个方向的最优报价填充）
  if (info[side].inverted) info[side].consideration = transform2Consideration(otrOptimalPrice);
  return info;
};

/** 使用双边报价获取该方向报价倒挂信息
 *  @param side 该方向
 *  @param bidPrice  bid 方向的报价
 *  @param bidCalcCleanPrice bid 方向的计算后的净价
 *  @param ofrPrice ofr 方向的报价
 *  @param ofrCalcCleanPrice ofr 方向的计算后的净价
 */
const getSideInvertedInfoByPrice = (params: {
  side: Side;
  bidPrice?: Partial<QuotePrice>;
  bidCalcCleanPrice?: number;
  ofrPrice?: Partial<QuotePrice>;
  ofrCalcCleanPrice?: number;
}) => {
  const { side, bidPrice, bidCalcCleanPrice, ofrPrice, ofrCalcCleanPrice } = params;
  /** 本方向报价 */
  let curPrice: Partial<QuotePrice> | undefined;
  /** 另一个方向报价 */
  let otrPrice: Partial<QuotePrice> | undefined;

  if (side === Side.SideBid) {
    curPrice = bidPrice;
    otrPrice = ofrPrice;
  } else {
    curPrice = ofrPrice;
    otrPrice = bidPrice;
  }

  const info: InvertedInfo = { inverted: false };

  // 如果本方向无报价，或价格（收益率、净价）为 0 或空（包含价格值为 0 或空时，点亮 F，反点值为 0 或为空），跳过倒挂提醒
  if (!has(curPrice) || isQuotePriceEmpty(curPrice)) return info;

  if (hasPrice(bidCalcCleanPrice) && hasPrice(ofrCalcCleanPrice) && !(bidCalcCleanPrice < ofrCalcCleanPrice)) {
    // 检查是否违反 「bid净价 < ofr净价」，如果是，该方向倒挂
    info.inverted = true;
  } else {
    // 比较两个价格，如果能够直接比较，直接根据差值获取倒挂信息，跳过计算器
    const gap = comparePrice(bidPrice, ofrPrice);

    if (has(gap?.value)) {
      if (gap?.quoteType === BondQuoteType.Yield) {
        info.inverted = !(gap.value > 0);
      } else if (gap?.quoteType === BondQuoteType.CleanPrice) {
        info.inverted = !(gap.value < 0);
      }
    }
  }

  if (info.inverted) info.consideration = transform2Consideration(otrPrice);
  return info;
};

/** 使用 ofr 方向最优报价获取 bid 方向报价倒挂信息（检查 bid 方向报价 B 与 ofr 方向最优报价 X 倒挂） */
const getBidInvertedInfoByOfrOptimalPrice = (
  bidPrice?: Partial<QuotePrice>,
  ofrOptimalPrice?: Partial<QuotePrice>,
  bidCalcCleanPrice?: number
) => {
  const info: InvertedInfo = { inverted: false };

  // 如果本方向无报价，或价格（收益率、净价）为 0 或空（包含价格值为 0 或空时，点亮 F，反点值为 0 或为空），跳过倒挂提醒
  if (!has(bidPrice) || isQuotePriceEmpty(bidPrice)) return info;

  if (hasPrice(bidCalcCleanPrice) && has(ofrOptimalPrice) && hasPrice(ofrOptimalPrice?.clean_price)) {
    // 检查 bid 方向报价价格计算后的净价，是否违反 「bid净价 < X计算后的净价」，如果是，需要提醒 bid 方向有倒挂
    info.inverted = !(bidCalcCleanPrice < fixFloatDecimal(ofrOptimalPrice.clean_price, 4));
  } else {
    // 检查 bid 方向报价 B 与 ofr 方向最优报价 X
    const gap = comparePrice(bidPrice, ofrOptimalPrice);

    if (has(gap?.value)) {
      if (gap?.quoteType === BondQuoteType.Yield) {
        info.inverted = !(gap.value > 0);
      } else if (gap?.quoteType === BondQuoteType.CleanPrice) {
        info.inverted = !(gap.value < 0);
      }
    }
  }

  if (info.inverted) info.consideration = transform2Consideration(ofrOptimalPrice);
  return info;
};

/** 使用 bid 方向最优报价获取 ofr 方向报价倒挂信息（检查 ofr 方向报价 O 与 bid 方向最优报价 Y 倒挂） */
const getOfrInvertedInfoByBidOptimalPrice = (
  ofrPrice?: Partial<QuotePrice>,
  bidOptimalPrice?: Partial<QuotePrice>,
  ofrCalcCleanPrice?: number
) => {
  const info: InvertedInfo = { inverted: false };

  // 如果本方向无报价，或价格（收益率、净价）为 0 或空（包含价格值为 0 或空时，点亮 F，反点值为 0 或为空），跳过倒挂提醒
  if (!has(ofrPrice) || isQuotePriceEmpty(ofrPrice)) return info;

  if (hasPrice(ofrCalcCleanPrice) && has(bidOptimalPrice) && hasPrice(bidOptimalPrice?.clean_price)) {
    // 检查 ofr 方向报价价格计算后的净价，是否违反 「ofr净价 > Y计算后的净价」，如果是，ofr 方向有倒挂
    info.inverted = !(ofrCalcCleanPrice > fixFloatDecimal(bidOptimalPrice.clean_price, 4));
  } else {
    // 检查 ofr 方向报价 O 与 bid 方向最优报价 Y
    const gap = comparePrice(ofrPrice, bidOptimalPrice);

    if (has(gap?.value)) {
      if (gap?.quoteType === BondQuoteType.Yield) {
        info.inverted = !(gap.value < 0);
      } else if (gap?.quoteType === BondQuoteType.CleanPrice) {
        info.inverted = !(gap.value > 0);
      }
    }
  }

  if (info.inverted) info.consideration = transform2Consideration(bidOptimalPrice);
  return info;
};

/**
 * 同时检查两个方向报价是否倒挂
 * @param dblOptimalPrice 该债券的两个方向的最优报价
 * @param dblPrice 该债券的两个方向的报价
 * @param bidCalc bid 方向计算得出的价格
 * @param ofrCalc ofr 方向计算得出的价格
 */
export const checkDoubleSideInverted = (
  dblOptimalPrice: DblSideQuotePrice,
  dblPrice: DblSideQuotePrice,
  bidCalc?: BaseDataMulCalculate.CalculateResult,
  ofrCalc?: BaseDataMulCalculate.CalculateResult
) => {
  const info: DblSideInvertedInfo = { [Side.SideBid]: { inverted: false }, [Side.SideOfr]: { inverted: false } };

  /** bid 方向报价 */
  const bidPrice = dblPrice[Side.SideBid];
  /** ofr 方向报价 */
  const ofrPrice = dblPrice[Side.SideOfr];
  /** bid 方向最优报价 */
  const bidOptimalPrice = dblOptimalPrice[Side.SideBid];
  /** ofr 方向最优报价 */
  const ofrOptimalPrice = dblOptimalPrice[Side.SideOfr];
  /** bid 方向计算得出的净价 */
  const bidCalcCleanPrice = formatCalcCleanPrice(bidCalc?.clean_price);
  /** ofr 方向计算得出的净价 */
  const ofrCalcCleanPrice = formatCalcCleanPrice(ofrCalc?.clean_price);

  // a
  // 当该债券当前 bid 和 ofr 均无最优报价，或最优报价为无价情况（即无净价，无价没有净价值），检查两侧报价价格
  if (!has(bidOptimalPrice) && !has(ofrOptimalPrice)) {
    info[Side.SideBid] = getSideInvertedInfoByPrice({
      side: Side.SideBid,
      bidPrice,
      bidCalcCleanPrice,
      ofrPrice,
      ofrCalcCleanPrice
    });
    info[Side.SideOfr] = getSideInvertedInfoByPrice({
      side: Side.SideOfr,
      bidPrice,
      bidCalcCleanPrice,
      ofrPrice,
      ofrCalcCleanPrice
    });

    return info;
  }

  // b
  // 当该债券当前 ofr 方向有最优报价 X，bid 方向无最优报价
  if (/** X */ has(ofrOptimalPrice) && !has(bidOptimalPrice)) {
    // 检查 bid 方向报价 B 与 ofr 方向最优报价 X
    info[Side.SideBid] = getBidInvertedInfoByOfrOptimalPrice(bidPrice, ofrOptimalPrice, bidCalcCleanPrice);
    // 若 bid 方向报价 B 与 ofr 方向最优报价 X 不倒挂，则进一步检查 bid 方向报价 B 与 ofr 方向报价 O
    if (!info[Side.SideBid].inverted) {
      info[Side.SideBid] = getSideInvertedInfoByPrice({
        side: Side.SideBid,
        bidPrice,
        bidCalcCleanPrice,
        ofrPrice,
        ofrCalcCleanPrice
      });
    }

    // 检查 ofr 方向报价 O 与 bid 方向报价 B
    info[Side.SideOfr] = getSideInvertedInfoByPrice({
      side: Side.SideOfr,
      ofrPrice,
      ofrCalcCleanPrice,
      bidPrice,
      bidCalcCleanPrice
    });
    return info;
  }

  // c
  // 当该债券当前 bid 方向有最优报价 Y，ofr 方向无最优报价
  if (/** Y */ has(bidOptimalPrice) && !has(ofrOptimalPrice)) {
    // 检查 bid 方向报价 B 与 ofr 方向报价 O
    info[Side.SideBid] = getSideInvertedInfoByPrice({
      side: Side.SideBid,
      bidPrice,
      bidCalcCleanPrice,
      ofrPrice,
      ofrCalcCleanPrice
    });
    // 检查 ofr 方向报价 O 与 bid 方向最优报价 Y
    info[Side.SideOfr] = getOfrInvertedInfoByBidOptimalPrice(ofrPrice, bidOptimalPrice, ofrCalcCleanPrice);
    // 若 ofr 方向报价 O 与 bid 方向最优报价 Y 不倒挂，则进步检查 ofr 方向报价 O 与 bid 方向报价 B
    if (!info[Side.SideOfr].inverted) {
      info[Side.SideOfr] = getSideInvertedInfoByPrice({
        side: Side.SideOfr,
        ofrPrice,
        ofrCalcCleanPrice,
        bidPrice,
        bidCalcCleanPrice
      });
    }

    return info;
  }

  // d
  // 当该债券当前 ofr 方向有最优报价 X，bid 方向有最优报价 Y
  if (/** X */ has(ofrOptimalPrice) && /** Y */ has(bidOptimalPrice)) {
    // 检查 bid 方向报价 B 与 ofr 方向最优报价 X
    info[Side.SideBid] = getBidInvertedInfoByOfrOptimalPrice(bidPrice, ofrOptimalPrice, bidCalcCleanPrice);
    // 若 bid 方向报价 B 与 ofr 方向最优报价 X 不倒挂，则进一步检查 bid 方向报价 B 与 ofr 方向报价 O
    if (!info[Side.SideBid].inverted)
      info[Side.SideBid] = getSideInvertedInfoByPrice({
        side: Side.SideBid,
        bidPrice,
        bidCalcCleanPrice,
        ofrPrice,
        ofrCalcCleanPrice
      });

    // 检查 ofr 方向报价 O 与 bid 方向最优报价 Y
    info[Side.SideOfr] = getOfrInvertedInfoByBidOptimalPrice(ofrPrice, bidOptimalPrice, ofrCalcCleanPrice);
    // 若 ofr 方向报价 O 与 bid 方向最优报价 Y 不倒挂，则进步检查 ofr 方向报价 O 与 bid 方向报价 B
    if (!info[Side.SideOfr].inverted)
      info[Side.SideOfr] = getSideInvertedInfoByPrice({
        side: Side.SideOfr,
        ofrPrice,
        ofrCalcCleanPrice,
        bidPrice,
        bidCalcCleanPrice
      });

    return info;
  }

  return info;
};

export type CheckQuoteReminderParams = {
  batch?: boolean;
  productType: ProductType;
  calcPriceQueryVars: CalcPriceQueryVar[];
  /** 是否使用弹窗提醒 */
  remind?: boolean;
  excludeQuoteId?: string;
};

/** 信用债收益率估值偏离提醒范围，属性名为 [min, max)，属性值为估值偏离的 bp 接受范围 */
const BCO_DEVIATION_RANGES = {
  '0-2.0': 30,
  '2.0-3.0': 20,
  '3.0-4.0': 30,
  '4.0-6.0': 100,
  '6.0-Infinity': 200
};

/**
 * 检查单个方向是否估值偏离
 * @params productType 产品类型
 * @param bond 债券信息
 * @param price 该方向录入的价格
 */
export const checkSideDeviation = (productType: ProductType, bond?: FiccBondBasic, price?: QuoteParamsType) => {
  if (productType === ProductType.BCO) return false;
  if (!bond) return false;
  if (!price) return false;

  let deviation = false;

  // 利率台目前不需要估值偏离，先检查信用台的（下述估值都适用中债估值）
  if (bond.product_type === ProductType.BCO) {
    const { quote_type, flag_rebate, flag_intention } = price;
    // 带返点时（点亮 F 返点按钮），或者为意向价不作提醒
    if (flag_rebate || flag_intention) return false;

    if (quote_type === BondQuoteType.Yield && price?.yield) {
      // 收益率报价时，非含权债使用到期收益率估值，含权债使用行权收益率估值
      const val = (!hasOption(bond) ? bond.val_yield_mat : bond.val_yield_exe) ?? 0;
      // 如果收益率为 0，则不提醒
      if (val === 0) return false;
      // https://shihetech.feishu.cn/docx/S5ggd5PDRo3rioxyrKwccaFun3f#part-ExF3dKq3YourQRxvX1EcOkxtnHq
      /** 收益率估值 bp */
      const bp = fixFloatDecimal(Math.abs(val - price.yield), 4) * 100;

      for (const [range, deviationBp] of Object.entries(BCO_DEVIATION_RANGES)) {
        const [min, max] = range.split('-');
        if (val >= Number(min) && val < Number(max)) {
          if (bp > deviationBp) deviation = true;
          break;
        }
      }
    } else if (quote_type === BondQuoteType.CleanPrice && price?.clean_price) {
      // 净价报价时，非含权债使用到期净价估值，含权债使用行权净价估值
      const val = !bond.has_option ? bond.val_clean_price_mat : bond.val_clean_price_exe;
      // 如果没有估值，不做提醒
      if (!hasPrice(val)) return false;
      // 无论估值，只要报价价格在 估值±1元外，则提醒
      if (Math.abs(price.clean_price - val) > 1) return true;
    }
  }

  return deviation;
};

/** 检查是否需要展示 ConfirmReminderModal */
export const checkShowConfirmReminderModal = (list: QuoteReminder[]) => {
  return list.some(
    item =>
      item[Side.SideBid]?.invertedInfo?.inverted ||
      item[Side.SideBid]?.deviation ||
      item[Side.SideOfr]?.invertedInfo?.inverted ||
      item[Side.SideOfr]?.deviation
  );
};

/** 比较该方向最优的价格 */
export const compareSideOptimalPrice = <T>(side: Side, quoteType: BondQuoteType, aLarger: boolean, a: T, b: T) => {
  let optimal: T | undefined;

  if (quoteType === BondQuoteType.Yield) {
    // 若为收益率比较
    if (side === Side.SideBid) {
      // bid 越小越优
      optimal = aLarger ? b : a;
    } else {
      // ofr 越大越优
      optimal = aLarger ? a : b;
    }
  } else if (quoteType === BondQuoteType.CleanPrice) {
    // 若为净价比较
    if (side === Side.SideBid) {
      // bid 越大越优
      optimal = aLarger ? a : b;
    } else {
      // ofr 越小越优
      optimal = aLarger ? b : a;
    }
  }

  return optimal;
};

export type CalcPriceQueryVarCache = {
  [key in Side.SideBid | Side.SideOfr]: CalcPriceQueryVar[];
};

export type CalcPriceQueryVarCaches = {
  [codeMarket in string]?: CalcPriceQueryVarCache;
};

export const getCalcPriceQueryVarCaches = (vars: CalcPriceQueryVar[]) => {
  const caches: CalcPriceQueryVarCaches = {};

  for (const queryVar of vars) {
    const codeMarket = queryVar?.bond?.code_market;
    if (!codeMarket) continue;

    let cache = caches?.[codeMarket];
    if (!cache) {
      caches[codeMarket] = { [Side.SideBid]: [], [Side.SideOfr]: [] };
      cache = caches[codeMarket];
    }

    if (cache && queryVar?.bidIsValid) cache[Side.SideBid].push(queryVar);
    if (cache && queryVar?.ofrIsValid) cache[Side.SideOfr].push(queryVar);
  }

  return caches;
};

/** 获取该方向的最优的 CalcPriceQueryVar */
export const getSideOptimalCalcPriceQueryList = (
  side: Side.SideBid | Side.SideOfr,
  codeMarket: string,
  calcPriceMap?: CalcPriceMap,
  priceList?: CalcPriceQueryVar[]
) => {
  priceList = priceList ?? [];

  let optimalVar: CalcPriceQueryVar | undefined;

  // 过滤掉非同方向，与无价的价格入参
  priceList = priceList.filter(item => {
    const price = item?.quoteParams?.[side];

    return (
      has(price) &&
      !isQuotePriceEmpty(price) &&
      ((side === Side.SideBid && item.bidIsValid) || (side === Side.SideOfr && item.ofrIsValid))
    );
  });

  if (!priceList.length || priceList.length == 1) return priceList;

  let calcList: BaseDataMulCalculate.CalculateResult[] = [];

  // 2.13 支持同交易员多报价，在协同报价处同一方向可能会存在多条报价
  for (const queryVar of priceList) {
    const eiPriceMapKey = getEiPriceMapKey({ codeMarket, ...queryVar.quoteParams });
    const eiPriceMap = calcPriceMap?.[eiPriceMapKey];
    const eiField = queryVar.quoteParams[side]?.flag_internal ? 'internal' : 'external';
    const calc = eiPriceMap?.[eiField]?.[side];

    // 如果有一条没有计算器结果，直接走前端比较价格逻辑
    if (!calc) {
      calcList = [];
      break;
    }

    calcList.push(calc);
  }

  // 如果计算器结果列表有值，那使用计算器计算后的净价比较最优入参
  if (calcList.length) {
    let [optimalCalc] = calcList;
    [optimalVar] = priceList;

    for (let i = 1, len = calcList.length; i < len; i++) {
      const calc = calcList[i];

      if (side === Side.SideBid) {
        // bid 净价越大越优
        if ((calc?.clean_price ?? 0) > (optimalCalc?.clean_price ?? 0)) {
          optimalCalc = calc;
          optimalVar = priceList[i];
        }
      } else if (side === Side.SideOfr) {
        // ofr 净价越小越优
        if ((calc?.clean_price ?? 0) < (optimalCalc?.clean_price ?? 0)) {
          optimalCalc = calc;
          optimalVar = priceList[i];
        }
      }
    }
  } else {
    // 否则走前端比较价格逻辑
    let optimalPrice = priceList?.[0]?.quoteParams?.[side];
    [optimalVar] = priceList;

    for (let i = 1, len = priceList.length; i < len; i++) {
      const price = priceList[i]?.quoteParams?.[side];
      // 比较两个价格
      const gap = comparePrice(price, optimalPrice);
      // 如果能够比较，取最优的价格
      if (has(gap?.value)) {
        if (side === Side.SideBid) {
          if (
            // 如果同为收益率，bid 收益率越小越优
            (gap?.quoteType === BondQuoteType.Yield && gap.value < 0) ||
            // 如果同为净价，bid 净价越大越优
            (gap?.quoteType === BondQuoteType.CleanPrice && gap.value > 0)
          ) {
            optimalPrice = price;
            optimalVar = priceList[i];
          }
        } else if (side === Side.SideOfr) {
          if (
            // 如果同为收益率，ofr 收益率越大越优
            (gap?.quoteType === BondQuoteType.Yield && gap.value > 0) ||
            // 如果同为净价，ofr 净价越小越优
            (gap?.quoteType === BondQuoteType.CleanPrice && gap.value < 0)
          ) {
            optimalPrice = price;
            optimalVar = priceList[i];
          }
        }
      } else {
        // 否则直接直接把最优价置空，跳过整个判断逻辑（因为此时所有报价的价格类型肯定不一致，无法获取最优价）
        optimalVar = undefined;
        break;
      }
    }
  }

  // 同一方向存在两条报价，则说明有明暗盘
  // if (priceList.length >= 2) {
  //   // 只取前两条，后续若有多的，说明获得 cache 时存在问题
  //   const [a, b] = priceList;
  //   const aPrice = a?.quoteParams?.[side];
  //   const bPrice = b?.quoteParams?.[side];
  //   // 直接比较两个价格
  //   const gap = comparePrice(aPrice, bPrice, false);

  //   if (has(gap?.quoteType) && has(gap?.value) && gap.value != 0) {
  //     const aLarger = gap.value > 0;
  //     optimalVar = compareSideOptimalPrice(side, gap.quoteType, aLarger, a, b);
  //   } else {
  //     // 若比较不出，需要通过计算器计算后的净价进行比较
  //     const aEiPriceMapKey = getEiPriceMapKey({ codeMarket, ...a?.quoteParams });
  //     const bEiPriceMapKey = getEiPriceMapKey({ codeMarket, ...b?.quoteParams });

  //     const aEiPriceMap = calcPriceMap?.[aEiPriceMapKey];
  //     const bEiPriceMap = calcPriceMap?.[bEiPriceMapKey];

  //     const aEiField = a.quoteParams[side]?.flag_internal ? 'internal' : 'external';
  //     const bEiField = b.quoteParams[side]?.flag_internal ? 'internal' : 'external';

  //     const aCalc = aEiPriceMap?.[aEiField]?.[side];
  //     const bCalc = bEiPriceMap?.[bEiField]?.[side];

  //     if (
  //       (!has(aCalc?.clean_price) || aCalc?.clean_price === SERVER_NIL) &&
  //       (!has(bCalc?.clean_price) || bCalc?.clean_price === SERVER_NIL)
  //     ) {
  //       optimalVar = void 0;
  //     } else if (!has(aCalc?.clean_price) || aCalc?.clean_price === SERVER_NIL) {
  //       optimalVar = b;
  //     } else if (!has(bCalc?.clean_price) || bCalc?.clean_price === SERVER_NIL) {
  //       optimalVar = a;
  //     } else {
  //       const priceGap = (aCalc?.clean_price ?? 0) - (bCalc?.clean_price ?? 0);
  //       if (priceGap == 0) return [a, b];

  //       optimalVar = compareSideOptimalPrice(side, BondQuoteType.CleanPrice, priceGap > 0, a, b);
  //     }
  //   }
  // }

  return [optimalVar].filter(Boolean);
};

/** 过滤相同 codeMarket 报价中价格不是最优的 CalcPriceQueryVar */
export const filterNotOptimalCalcPriceQueryVars = (vars: CalcPriceQueryVar[], calcPriceMap: CalcPriceMap) => {
  vars = [...vars];

  const varCaches = getCalcPriceQueryVarCaches(vars);

  for (const [codeMarket, cache] of Object.entries(varCaches)) {
    const bidOptimalList = getSideOptimalCalcPriceQueryList(
      Side.SideBid,
      codeMarket,
      calcPriceMap,
      cache?.[Side.SideBid]
    );
    const ofrOptimalList = getSideOptimalCalcPriceQueryList(
      Side.SideOfr,
      codeMarket,
      calcPriceMap,
      cache?.[Side.SideOfr]
    );

    // 若 bid 方向有最优的 CalcPriceQueryVar
    if (bidOptimalList.length > 0) {
      // 需要从 calcPriceQueryVars 中移除 bid 方向所有的 item
      vars = vars.filter(
        item => item.bond?.code_market != codeMarket || (item.bond?.code_market == codeMarket && !item?.bidIsValid)
      );
      // 然后往 calcPriceQueryVars 新加入最优的 CalcPriceQueryVar，为后续合并做准备
      vars.push(...bidOptimalList);
    }

    if (ofrOptimalList.length > 0) {
      vars = vars.filter(
        item => item.bond?.code_market != codeMarket || (item.bond?.code_market == codeMarket && !item?.ofrIsValid)
      );
      vars.push(...ofrOptimalList);
    }
  }

  return vars;
};

/** 批量模式下对内部价格进行倒挂检查 */
const checkSideInternalInverted = (
  side: Side, // 当前报价的方向
  dblPrice: DblSideQuotePrice, // 当前报价
  otrPriceList: CalcPriceQueryVar[], // 对向最优报价列表
  calcPriceMap?: CalcPriceMap, // 计算器结果，可能要用净价进行比较
  calcCleanPrice?: number // 当前方向计算后的净价
) => {
  const [otrPriceQueryVar] = otrPriceList;
  const otrSide = side == Side.SideBid ? Side.SideOfr : Side.SideBid;
  const otrPrice = otrPriceQueryVar.quoteParams?.[otrSide];
  const otrCodeMarket = otrPriceQueryVar?.bond?.code_market;

  const otrEiField = otrPrice?.flag_internal ? 'internal' : 'external';

  const otrEiPriceMapKey = getEiPriceMapKey({ codeMarket: otrCodeMarket, ...otrPriceQueryVar?.quoteParams });
  const otrEiPriceMap = calcPriceMap?.[otrEiPriceMapKey];

  const internalOptimalPriceMap: DblSideQuotePrice = {
    [otrSide]: {
      ...otrPrice,
      clean_price: otrEiPriceMap?.[otrEiField]?.[otrSide]?.clean_price ?? otrPrice?.clean_price
    }
  };

  return checkSideInverted(side, internalOptimalPriceMap, dblPrice, calcCleanPrice);
};

/** 检查报价提醒信息 */
export const checkQuoteReminder = (
  { batch, productType, calcPriceQueryVars, excludeQuoteId, remind = true }: CheckQuoteReminderParams,
  ctx = context.active()
): Promise<[boolean, QuoteReminder[]]> => {
  return new Promise(resolve => {
    const keyMarketList = calcPriceQueryVars.map(item => item.bond?.key_market).filter(Boolean);

    Promise.all([
      // 获取两个方向最优报价的集合
      queryClient.fetchQuery({
        queryKey: useOptimalPriceQuery.getKey({ productType, keyMarketList, excludeQuoteId }),
        queryFn: async queryCtx => withCtx(ctx, useOptimalPriceQuery.queryFn, queryCtx)
      }),
      // 获取用户报价计算后得出的价格
      queryClient.ensureQueryData({
        queryKey: useCalcPriceQuery.getKey(calcPriceQueryVars),
        queryFn: async queryCtx => withCtx(ctx, useCalcPriceQuery.queryFn, queryCtx)
      })
    ])
      .then(([optimalPriceMap, calcPriceMap]) => {
        logger.ctxInfo(
          ctx,
          '[checkQuoteReminder] start check reminder, ' +
            `optimalPriceMap=${JSON.stringify(optimalPriceMap)}, calcPriceMap=${JSON.stringify(calcPriceMap)}`
        );

        const reminderList: QuoteReminder[] = [];

        let varCaches: CalcPriceQueryVarCaches | undefined;

        if (batch) {
          /** 不改变入参的顺序，保证返回的 reminders 顺序与入参 calcPriceQueryVars 一致 */
          let priceList = [...calcPriceQueryVars];
          // 过滤价格不是最优的 CalcPriceQueryVar
          priceList = filterNotOptimalCalcPriceQueryVars(priceList, calcPriceMap);
          varCaches = getCalcPriceQueryVarCaches(priceList);
        }

        for (const { bond, quoteParams, bidIsValid, ofrIsValid, bidIndex, ofrIndex } of calcPriceQueryVars) {
          let dblInvertedInfo: DblSideInvertedInfo = {
            [Side.SideBid]: { inverted: false },
            [Side.SideOfr]: { inverted: false }
          };
          let bidDeviation: boolean | undefined;
          let ofrDeviation: boolean | undefined;
          let varCache: CalcPriceQueryVarCache | undefined;

          const keyMarket = bond?.key_market ?? '';
          const codeMarket = bond?.code_market ?? '';

          const dblOptimalPrice = optimalPriceMap?.[keyMarket] ?? {};
          const eiPriceMapKey = getEiPriceMapKey({ codeMarket, ...quoteParams });
          const eiPriceMap = calcPriceMap?.[eiPriceMapKey];

          const bidPrice = quoteParams[Side.SideBid];
          const ofrPrice = quoteParams[Side.SideOfr];
          const bidEiField = bidPrice?.flag_internal ? 'internal' : 'external';
          const ofrEiField = ofrPrice?.flag_internal ? 'internal' : 'external';
          const bidCalc = eiPriceMap?.[bidEiField]?.[Side.SideBid];
          const ofrCalc = eiPriceMap?.[ofrEiField]?.[Side.SideOfr];

          if (batch) varCache = varCaches?.[codeMarket];

          // 检查倒挂与估值偏离
          if (bidIsValid && ofrIsValid) {
            dblInvertedInfo = checkDoubleSideInverted(dblOptimalPrice, quoteParams, bidCalc, ofrCalc);

            bidDeviation = checkSideDeviation(productType, bond, bidPrice);
            ofrDeviation = checkSideDeviation(productType, bond, ofrPrice);
          } else if (bidIsValid) {
            const side = Side.SideBid;

            dblInvertedInfo = checkSideInverted(side, dblOptimalPrice, quoteParams, bidCalc?.clean_price);

            /** 批量模式下，双边报价未合并，需要在此处进一步检查报价内部是否有倒挂 */
            if (batch) {
              const ofrPriceList = varCache?.[Side.SideOfr];

              /** 若存在对向报价，则使用对向最优报价构造 internalOptimalPriceMap 进行校验，反向亦然 */
              if (!dblInvertedInfo[side].inverted && ofrPriceList && ofrPriceList.length > 0) {
                dblInvertedInfo = checkSideInternalInverted(
                  side,
                  quoteParams,
                  ofrPriceList,
                  calcPriceMap,
                  bidCalc?.clean_price
                );
              }
            }

            bidDeviation = checkSideDeviation(productType, bond, bidPrice);
          } else if (ofrIsValid) {
            const side = Side.SideOfr;

            dblInvertedInfo = checkSideInverted(side, dblOptimalPrice, quoteParams, ofrCalc?.clean_price);

            /** 批量模式下，双边报价未合并，需要在此处进一步检查报价内部是否有倒挂 */
            if (batch) {
              const bidPriceList = varCache?.[Side.SideBid];

              /** 若存在对向报价，则使用对向最优报价构造 internalOptimalPriceMap 进行校验，反向亦然 */
              if (!dblInvertedInfo[side].inverted && bidPriceList && bidPriceList.length > 0) {
                dblInvertedInfo = checkSideInternalInverted(
                  side,
                  quoteParams,
                  bidPriceList,
                  calcPriceMap,
                  ofrCalc?.clean_price
                );
              }
            }

            ofrDeviation = checkSideDeviation(productType, bond, ofrPrice);
          }

          // 添加到 reminderList
          reminderList.push({
            bond,
            bidIndex,
            ofrIndex,
            [Side.SideBid]: {
              quote: bidPrice,
              calcRes: bidCalc,
              invertedInfo: dblInvertedInfo[Side.SideBid],
              deviation: bidDeviation
            },
            [Side.SideOfr]: {
              quote: ofrPrice,
              calcRes: ofrCalc,
              invertedInfo: dblInvertedInfo[Side.SideOfr],
              deviation: ofrDeviation
            }
          });
        }

        logger.ctxInfo(ctx, `[checkQuoteReminder] reminderList=${JSON.stringify(reminderList)}`);
        if (!remind || !checkShowConfirmReminderModal(reminderList)) {
          resolve([true, reminderList]);
          return;
        }

        logger.ctxInfo(ctx, '[checkQuoteReminder] show confirm reminder modal');
        showConfirmReminderModal({
          productType,
          list: reminderList,
          batch,
          onOk: () => {
            logger.ctxInfo(ctx, '[checkQuoteReminder] user confirmed');
            resolve([true, reminderList]);
          },
          onCancel: () => {
            logger.ctxInfo(ctx, '[checkQuoteReminder] user denied');
            resolve([false, reminderList]);
          }
        });
      })
      .catch(err => {
        logger.ctxError(ctx, `[checkQuoteReminder] failed load quote reminder data, err=${errorToString(err)}`);
        resolve([false, []]);
      });
  });
};
