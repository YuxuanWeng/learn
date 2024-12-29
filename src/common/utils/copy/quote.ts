import { FRTypeFullMap, SideMap } from '@fepkg/business/constants/map';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL, SPACE_TEXT } from '@fepkg/common/constants';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { FiccBondBasic, LiquidationSpeed, QuickChatQuoteInfo } from '@fepkg/services/types/common';
import {
  AlgoBondQuoteType,
  BondCategory,
  BondQuoteType,
  FRType,
  PerpType,
  ProductType,
  Side,
  UserSettingFunction
} from '@fepkg/services/types/enum';
import { context } from '@opentelemetry/api';
import { pick } from 'lodash-es';
import { fetchBondOptimalQuoteByFilter } from '@/common/services/api/bond-optimal-quote/filter';
import { trackSpecialSlow } from '@/common/utils/logger/special';
import { CommentFlagKeys, Exercise, Maturity } from '@/components/Quote/types';
import { getCommentFlagLabel } from '@/components/Quote/utils';
import { CommentInputFlagValue } from '@/components/business/CommentInput';
import { getOneUserSettingsValue } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { getRestDayNum } from '../bond';
import { formatLiquidationSpeedListToString } from '../liq-speed';
import { logger } from '../logger';

export type QuoteForCopy = {
  quote_type: BondQuoteType;
  price?: number; // 报价，copyChatQuicklyQuotes->QuickChatHandicap和fromCardItemToCopyMsg->QuoteHandicap
  quote_price?: number; // 报价，quoteLite中
  yield: number;
  clean_price: number;
  full_price: number;
  spread: number;
  return_point: number;
  flag_intention?: boolean;
  flag_internal?: boolean;
  flag_rebate?: boolean;
  side: number;
  flag_star: number;
  flag_oco?: boolean;
  flag_package?: boolean;
  liquidation_speed_list?: LiquidationSpeed[];
  exercise_manual?: boolean;
  is_exercise?: boolean;
  comment: string;
  volume: number;
  bond_basic_info?: FiccBondBasic;
  quote_id: string;
  flag_exchange?: boolean;
};

type OptimalQuoteForCopy = {
  bond_basic_info: FiccBondBasic;
  quote_bid_list?: QuoteForCopy[];
  quote_ofr_list?: QuoteForCopy[];
  optimal_price_id_list_bid?: string[]; // 最优价格对应 报价id list bid方向
  optimal_price_id_list_ofr?: string[]; // 最优价格对应 报价id list ofr方向
  optimal_price_ext_id_list_bid?: string[]; // 明盘最优价格对应的报价 id list bid方向
  optimal_price_ext_id_list_ofr?: string[]; // 明盘最优价格对应的报价 id list ofr方向
};

const getPrice = (quote: QuoteForCopy) => {
  return quote?.price ?? quote.quote_price;
};

const formatNum = (num?: number) => {
  if (num === undefined || num < 0) return 0;
  return Math.round(num * 10000) / 10000;
};

export const getTimeToMaturity = (bond: FiccBondBasic) => {
  let result = bond?.time_to_maturity ?? '';
  const restDayNum = getRestDayNum(bond.rest_day_to_workday);

  if (restDayNum) {
    result += `(休${restDayNum})`;
  }

  return result;
};

/**
 * 格式化价格（无价返回0.00，最小精确到两位小数）
 * @param value 价格
 * @param maxDigit 最高精度-小数位数
 * @param minDigit 最小精度-小数位数，默认为2
 */
export function formatPrice(value: number | undefined, maxDigit: number, minDigit = 2): string {
  if (!value || value <= 0) return '--';

  for (let i = maxDigit; i >= minDigit; i--) {
    if (Number(value.toFixed(i)) !== value) {
      return value.toFixed(Math.min(i + 1, maxDigit));
    }
  }
  return value.toFixed(minDigit);
}

export const getBondName = (bond: FiccBondBasic, productType: ProductType) => {
  if (productType === ProductType.BNC) {
    if (bond.bond_category === BondCategory.LGB) {
      // 简称(地方债时显示);票面利率
      return `${bond.short_name};${formatPrice(bond.coupon_rate_current, 4)}`;
    }
  }
  // 简称
  return bond.short_name ?? '';
};

const preserveLeastDigit = (value: number, digit: number) => {
  return Number(value.toFixed(digit)) === value ? value.toFixed(2) : value.toString();
};

const getPriceText = (quote: QuoteForCopy, optimalPrice?: number, isInvalid = false) => {
  const raw = optimalPrice ?? getPrice(quote);

  const price = formatNum(raw || 0);

  const priceText = preserveLeastDigit(price, 2);

  const returnPoint = (quote.return_point ?? SERVER_NIL) <= 0 ? '--' : preserveLeastDigit(quote.return_point, 2);

  if (isInvalid && quote.flag_intention && !quote.flag_rebate) return '';

  if (quote.flag_intention && !quote.flag_rebate) {
    // return quote.side === Side.SideBid?'Bid' : 'Ofr';
    return SideMap[quote.side as Side].firstUpperCase;
  }

  if (quote.flag_rebate && (raw == null || raw < 0) && returnPoint === '') {
    return '平价返';
  }

  const hasPrice = raw != undefined && raw >= 0;

  if (quote.flag_rebate) {
    return `${!hasPrice ? '--' : priceText}F${returnPoint}`;
  }

  if (!hasPrice) return '';

  return String(priceText || '');
};

const getComment = (quote: QuoteForCopy, bond: FiccBondBasic, withStar = true) => {
  let result;

  let comments: string[] = [];

  if (quote.flag_star != null && quote.flag_star >= 1 && withStar) {
    comments.push('*'.repeat(quote.flag_star));
  }

  if (quote.flag_oco) {
    comments.push('oco');
  }

  if (quote.flag_package) {
    comments.push('打包');
  }

  if (quote.flag_exchange) {
    comments.push('换券');
  }

  if (quote.liquidation_speed_list) {
    comments.push(formatLiquidationSpeedListToString(quote.liquidation_speed_list, 'MM.DD'));
  }

  // 复制备注标签
  const flagValue = pick(quote, CommentFlagKeys);
  if (flagValue) {
    let flagLabel = getCommentFlagLabel(flagValue as CommentInputFlagValue);

    if (quote.exercise_manual && hasOption(bond)) {
      if (quote.is_exercise) flagLabel += Exercise.label;
      else flagLabel += Maturity.label;
    }

    if (quote.comment) {
      flagLabel += quote.comment;
    }

    comments.push(flagLabel);
  }

  if (quote.quote_type === BondQuoteType.FullPrice) {
    comments.push('全价');
  } else if (quote.quote_type === BondQuoteType.CleanPrice) {
    comments.push('净价');
  }

  comments = comments.filter(Boolean);

  if (comments.length !== 0) {
    result = `(${comments.join(',')})`;
  }

  return result ?? '';
};

const getPriceAndVolumePerSide = (
  quotes: QuoteForCopy[],
  productType: ProductType,
  bond,
  optimalPrice?: number,
  isInvalid = false
) => {
  let priceStarString: string | null = null;

  const volumes: string[] = [];

  quotes.forEach(quote => {
    const { flag_star } = quote;

    const curStarString = '*'.repeat(flag_star);

    if (priceStarString == null || curStarString === priceStarString) {
      priceStarString = curStarString;
    } else {
      priceStarString = '';
    }
  });

  if (productType === ProductType.BNC || isInvalid) {
    priceStarString = '';
  }

  quotes.forEach(quote => {
    const { volume } = quote;

    if (!isInvalid) {
      volumes.push(
        `${volume == null || volume <= 0 ? '--' : volume.toString()}${getComment(quote, bond, priceStarString === '')}`
      );
    } else {
      volumes.push(volume.toString());
    }
  });

  const price = `${getPriceText(quotes[0], optimalPrice, isInvalid) || '--'}${priceStarString}`;

  return {
    price,
    volume: volumes.join('+')
  };
};

export const getPriceAndVolumeBothSide = (
  quotes: QuoteForCopy[],
  bond: FiccBondBasic,
  productType: ProductType,
  optimalPrices?: (number | undefined)[],
  isInvalid = false
) => {
  const bids: QuoteForCopy[] = [];
  const ofrs: QuoteForCopy[] = [];

  quotes.forEach(quote => {
    if (quote.side === Side.SideBid) {
      bids.push(quote);
    } else {
      ofrs.push(quote);
    }
  });

  const getResult = (sideQuotes: QuoteForCopy[], optimalPrice?: number) => {
    if (sideQuotes.length === 0) return null;

    return getPriceAndVolumePerSide(sideQuotes, productType, bond, optimalPrice, isInvalid);
  };

  const bidResult = getResult(bids, (optimalPrices ?? [])[0]);
  const ofrResult = getResult(ofrs, (optimalPrices ?? [])[1]);

  if (isInvalid) {
    return {
      price: bidResult?.price || ofrResult?.price || '--',
      volume: bidResult?.volume || ofrResult?.volume || '--'
    };
  }

  return {
    price: `${bidResult?.price || '--'}/${ofrResult?.price || '--'}`,
    volume: `${bidResult?.volume || '--'}/${ofrResult?.volume || '--'}`
  };
};

/** 评级(主体评级/债券评级) */
export const getRating = (bond: FiccBondBasic, productType?: ProductType) => {
  if (productType === ProductType.NCD) {
    return bond.issuer_rating ?? '';
  }
  const resultList = bond.issuer_rating === bond.rating ? [bond.rating] : [bond.issuer_rating, bond.rating];

  return resultList.filter(r => !!r && r !== 'A-1').join('/');
};

export const getWarrant = (bond: FiccBondBasic) => (bond.with_warranty ? '有担保' : '');

export const getFRType = (bond: FiccBondBasic) => {
  const result = bond.fr_type === FRType.FRD ? '' : FRTypeFullMap[bond.fr_type];

  const delistedDate = normalizeTimestamp(bond.delisted_date ?? '');
  const nextCouponDate = normalizeTimestamp(bond.next_coupon_date ?? '');

  if (result === '') return result;

  if (delistedDate != null && nextCouponDate != null && delistedDate < nextCouponDate) {
    return `原${result}`;
  }

  return result ?? '';
};

export const getListDate = (bond: FiccBondBasic): string => {
  const time = normalizeTimestamp(bond.listed_date ?? '');

  if (time == null || time < Date.now()) return '';

  return formatDate(bond.listed_date, 'MM.DD上市');
};

export const getValuation = (bond: FiccBondBasic) => {
  let result = '';
  const valYield = formatNum(bond.val_yield_exe);

  if (bond.has_option) {
    if (bond.perp_type === PerpType.NotPerp) {
      result = [valYield, formatNum(bond.val_yield_mat)].filter(v => v > 0).join('|');
    } else if (valYield > 0) {
      result = valYield.toString();
    }
  } else {
    result = (valYield || formatNum(bond.val_yield_mat)).toString();
  }

  if (result === '0') return '';

  return result === '' ? '' : `估值:${result}`;
};

export const getDuration = (bond: FiccBondBasic) => {
  if (bond.val_modified_duration === undefined || bond.val_modified_duration <= 0) return '';
  return `久期:${bond.val_modified_duration.toString()}`;
};

/** 地方债类型格式化输出 */
export const getLGBType = (bond: FiccBondBasic): string => {
  if (bond.bond_category !== BondCategory.LGB) return '';
  if (bond.fund_objective_sub_category === '一般债券') return '一般债';
  if (bond.fund_objective_sub_category === '普通专项') return '普通专项债';
  return bond.fund_objective_category?.replace('专项', '') ?? '';
};

export const getIssueAmount = (bond: FiccBondBasic) => {
  const amount = Number(bond.issue_amount) > 0 ? Number(bond.issue_amount) / 10000 : 0;

  if (amount === 0) return '';

  return `发行量:${amount}亿`;
};

export const getMaturityDate = (bond: FiccBondBasic) => {
  return `到期日:${formatDate(bond.maturity_date)}`;
};

const getQuoteBasicCopyText = (
  quote: QuoteForCopy,
  showValuation?: boolean,
  showDuration?: boolean,
  showIssueAmount?: boolean,
  showMaturityDate?: boolean
) => {
  const bond = quote.bond_basic_info;
  if (bond == null) return [];

  const productType = bond.product_type;
  const priceAndVolume = getPriceAndVolumeBothSide([quote], bond, productType);

  switch (productType) {
    case ProductType.BCO:
    case ProductType.NCD:
      return [
        getTimeToMaturity(bond),
        getBondName(bond, productType),
        bond.display_code,
        priceAndVolume.price,
        priceAndVolume.volume,
        getRating(bond, productType),
        getWarrant(bond),
        getFRType(bond),
        getListDate(bond),
        showValuation ? getValuation(bond) : '',
        showDuration ? getDuration(bond) : '',
        showIssueAmount ? getIssueAmount(bond) : '',
        showMaturityDate ? getMaturityDate(bond) : ''
      ];
    case ProductType.BNC:
      return [
        getTimeToMaturity(bond),
        bond.display_code,
        getBondName(bond, productType),
        priceAndVolume.price,
        priceAndVolume.volume,
        getFRType(bond),
        getListDate(bond),
        getLGBType(bond),
        showValuation ? getValuation(bond) : '',
        showDuration ? getDuration(bond) : '',
        showIssueAmount ? getIssueAmount(bond) : '',
        showMaturityDate ? getMaturityDate(bond) : ''
      ];
    default:
      return [];
  }
};

const getQuoteReferredCopyText = (quote: QuoteForCopy) => {
  const bond = quote.bond_basic_info;
  if (bond == null) return [];

  const productType = bond.product_type;
  const priceAndVolume = getPriceAndVolumeBothSide([quote], bond, productType, undefined, true);

  switch (productType) {
    case ProductType.BCO:
    case ProductType.NCD:
      return [
        getTimeToMaturity(bond),
        getBondName(bond, productType),
        bond.display_code,
        priceAndVolume.price,
        String(SideMap[quote.side].lowerCase),
        'ref'
      ];
    case ProductType.BNC:
      return [
        getTimeToMaturity(bond),
        bond.display_code,
        getBondName(bond, productType),
        priceAndVolume.price,
        String(SideMap[quote.side].lowerCase),
        getLGBType(bond),
        'ref'
      ];
    default:
      return [];
  }
};

const getQuoteOptimalCopyText = (
  quote: OptimalQuoteForCopy,
  includeInternal: boolean,
  showValuation?: boolean,
  showDuration?: boolean,
  showIssueAmount?: boolean,
  showMaturityDate?: boolean
) => {
  const bond = quote.bond_basic_info;

  const bidQuotes =
    quote.quote_bid_list?.filter(
      q =>
        (includeInternal ? quote.optimal_price_id_list_bid : quote.optimal_price_ext_id_list_bid)?.includes(q.quote_id)
    ) ?? [];
  const ofrQuotes =
    quote.quote_ofr_list?.filter(
      q =>
        (includeInternal ? quote.optimal_price_id_list_ofr : quote.optimal_price_ext_id_list_ofr)?.includes(q.quote_id)
    ) ?? [];

  const bidPrice = bidQuotes.length && getPrice(bidQuotes[0]);
  const ofrPrice = ofrQuotes.length && getPrice(ofrQuotes[0]);

  const quoteList = [...ofrQuotes, ...bidQuotes];
  const optimalHasInternal = quoteList.some(q => q.flag_internal);

  const productType = bond.product_type;
  const priceAndVolume = getPriceAndVolumeBothSide(quoteList, bond, productType, [bidPrice, ofrPrice]);

  switch (productType) {
    case ProductType.BCO:
    case ProductType.NCD:
      return [
        optimalHasInternal ? '暗盘' : '',
        getTimeToMaturity(bond),
        getBondName(bond, productType),
        bond.display_code,
        priceAndVolume.price,
        priceAndVolume.volume,
        getRating(bond, productType),
        getWarrant(bond),
        getFRType(bond),
        getListDate(bond),
        showValuation ? getValuation(bond) : '',
        showDuration ? getDuration(bond) : '',
        showIssueAmount ? getIssueAmount(bond) : '',
        showMaturityDate ? getMaturityDate(bond) : ''
      ];
    case ProductType.BNC:
      return [
        getTimeToMaturity(bond),
        bond.display_code,
        getBondName(bond, productType),
        priceAndVolume.price,
        priceAndVolume.volume,
        getFRType(bond),
        getListDate(bond),
        getLGBType(bond),
        showValuation ? getValuation(bond) : '',
        showDuration ? getDuration(bond) : '',
        showIssueAmount ? getIssueAmount(bond) : '',
        showMaturityDate ? getMaturityDate(bond) : ''
      ];
    default:
      return [];
  }
};

export const getQuoteCopyText = (
  quote: QuoteForCopy | OptimalQuoteForCopy,
  tableKey: ProductPanelTableKey,
  includeInternal = false
) => {
  let result: string[];
  const showValuation = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeValuation);
  const showDuration = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeDuration);
  const showIssueAmount = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeIssueAmount);
  const showMaturityDate = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeMaturityDate);

  switch (tableKey) {
    case ProductPanelTableKey.Basic:
      result = getQuoteBasicCopyText(
        quote as QuoteForCopy,
        showValuation,
        showDuration,
        showIssueAmount,
        showMaturityDate
      );
      break;
    case ProductPanelTableKey.Optimal:
      result = getQuoteOptimalCopyText(
        quote as OptimalQuoteForCopy,
        includeInternal,
        showValuation,
        showDuration,
        showIssueAmount,
        showMaturityDate
      );
      break;
    case ProductPanelTableKey.Referred:
      result = getQuoteReferredCopyText(quote as QuoteForCopy);
      break;
    default:
      result = [];
      break;
  }
  return result.filter(Boolean).join(SPACE_TEXT.repeat(4));
};

export const compareExpire = (a?: string, b?: string) => {
  if (a == null) return -1;
  if (b == null) return 1;

  const aPre = a.split('+')[0];
  const bPre = b.split('+')[0];

  if (aPre.endsWith('Y') && bPre.endsWith('D')) {
    return 1;
  }

  if (bPre.endsWith('Y') && aPre.endsWith('D')) {
    return -1;
  }

  return Number(aPre.slice(0, -1)) - Number(bPre.slice(0, -1));
};

const getCopyQuotesContent = (
  quotes: (QuoteForCopy | OptimalQuoteForCopy)[],
  tableKey: ProductPanelTableKey,
  isAltPressed = false,
  alwaysInternal = false
) => {
  const sortByTerm = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingSortByTerm);

  // 0 为按 alt 复制
  const altForInternal = getOneUserSettingsValue(UserSettingFunction.UserSettingOptimalQuoteCopyMethod) === 0;

  const includeInternal = alwaysInternal ? true : isAltPressed === altForInternal;
  return (
    sortByTerm
      ? [...quotes].sort((a, b) => {
          return compareExpire(a.bond_basic_info?.time_to_maturity, b.bond_basic_info?.time_to_maturity);
        })
      : quotes
  ).map(quote => getQuoteCopyText(quote, tableKey, includeInternal));
};

export const copyQuotes = (
  quotes: (QuoteForCopy | OptimalQuoteForCopy)[],
  tableKey: ProductPanelTableKey,
  isAltPressed = false
) => {
  const result = getCopyQuotesContent(quotes, tableKey, isAltPressed);
  const copyContent = result.join('\n');
  window.Main.copy(copyContent);
};

// 用于完整报价的复制，此种情况下只导出明盘数据
export const getCopyQuotesContentWithTitle = (
  quotes: (QuoteForCopy | OptimalQuoteForCopy)[],
  tableKey: ProductPanelTableKey,
  title: string,
  isAltPressed = false
) => {
  return [title, ...getCopyQuotesContent(quotes, tableKey, isAltPressed, true)];
};

/**
 * 等待一段时间后再执行后续操作
 * @param time 等待时间（默认为 1000）
 */
export const delay = async (time = 1000) =>
  new Promise(resolve => {
    setTimeout(resolve, time);
  });

export const copyQuotesByID = async (
  productType: ProductType,
  bondIDs?: string[],
  quotes?: QuoteForCopy[],
  includesCrossMkt = true,
  ctx = context.active()
) => {
  if (quotes && quotes.length > 1) return;
  await delay(100);

  try {
    const finalBondIDs = [...new Set(bondIDs ?? quotes?.map(q => q.bond_basic_info?.code_market) ?? [])].filter(
      Boolean
    );
    const bondKeyList = [...new Set(bondIDs ?? quotes?.map(q => q?.bond_basic_info?.bond_key) ?? [])].filter(Boolean);
    const keyMarketList = [...new Set(bondIDs ?? quotes?.map(q => q?.bond_basic_info?.key_market) ?? [])].filter(
      Boolean
    );

    const res = await fetchBondOptimalQuoteByFilter(
      {
        product_type: productType,
        // 需要跨市场债券的最优报价，传此字段，否则传key_market_list
        bond_key_list: includesCrossMkt ? bondKeyList : void 0,
        key_market_list: !includesCrossMkt ? keyMarketList : void 0
      },
      { traceCtx: ctx }
    );

    if (
      ((res.optimal_quote_list ?? []).length === 0 ||
        res.optimal_quote_list?.every(o => o.n_bid === 0 && o.n_ofr === 0)) &&
      quotes &&
      quotes.length !== 0
    ) {
      copyQuotes(quotes, ProductPanelTableKey.Referred);
      return;
    }

    const result = [
      ...finalBondIDs.map(bondId => res.optimal_quote_list?.find(q => q.bond_basic_info.code_market === bondId)),
      ...(res.optimal_quote_list ?? []).filter(q => !finalBondIDs.includes(q.bond_basic_info.code_market))
    ].filter(Boolean);
    copyQuotes(result as OptimalQuoteForCopy[], ProductPanelTableKey.Optimal);
  } catch (err) {
    logger.ctxError(ctx, `[copyQuotesByID] failed copy quotes, err=${err}`);
    trackSpecialSlow('报价复制失败', err);
  }
};

const parseQuote: (quote: QuickChatQuoteInfo, fake_id: string) => QuoteForCopy = (quote, fake_id) => {
  return {
    ...quote,
    quote_id: fake_id,
    quote_type: quote.quote_type as number as BondQuoteType,
    yield: (quote.quote_type === AlgoBondQuoteType.Yield ? quote.price : quote.yield) ?? -1,
    full_price: (quote.quote_type === AlgoBondQuoteType.FullPrice ? quote.price : quote.full_price) ?? -1,
    clean_price: (quote.quote_type === AlgoBondQuoteType.CleanPrice ? quote.price : quote.clean_price) ?? -1,
    spread: quote.spread ?? -1,
    return_point: quote.return_point ?? -1,
    flag_star: quote.flag_star ?? 0,
    comment: quote.comment ?? '',
    volume: quote.volume ?? 0
  };
};

// export const copyChatQuicklyQuotes = (quotes: QuickChatHandicap[]) => {
//   const quotesForCopy = quotes.map(q => {
//     const bidList = (q.bid_quote_list ?? []).map((quote, index) => parseQuote(quote, index.toString()));
//     const ofrList = (q.ofr_quote_list ?? []).map((quote, index) => parseQuote(quote, index.toString()));

//     return {
//       bond_basic_info: {
//         ...q.bond_info,
//         fund_objective_category: q.bond_info.fund_objective_category ?? '',
//         fund_objective_sub_category: q.bond_info.fund_objective_sub_category ?? '',
//         time_to_maturity: q.bond_info.time_to_maturity ?? '',
//         issuer_rating: q.bond_info.issuer_rating ?? '',
//         rating: q.bond_info.rating ?? '',
//         listed_date: q.bond_info.listed_date ?? '',
//         delisted_date: q.bond_info.delisted_date ?? '',
//         next_coupon_date: q.bond_info.next_coupon_date ?? '',
//         maturity_date: q.bond_info.maturity_date ?? '',
//         coupon_rate_current: q.bond_info.coupon_rate_current ?? 0,
//         val_yield_exe: q.bond_info.val_yield_exe ?? 0,
//         val_yield_mat: q.bond_info.val_yield_mat ?? 0,
//         val_modified_duration: q.bond_info.val_modified_duration ?? 0,
//         issue_amount: q.bond_info.issue_amount ?? 0,
//         has_option: q.bond_info.has_option ?? false,
//         with_warranty: q.bond_info.with_warranty ?? false
//       } as unknown as FiccBondBasic,
//       quote_bid_list: bidList,
//       quote_ofr_list: ofrList,
//       optimal_price_id_list_bid: bidList.map(quote => quote.quote_id), // 最优价格对应 报价id list bid方向
//       optimal_price_id_list_ofr: ofrList.map(quote => quote.quote_id), // 最优价格对应 报价id list ofr方向
//       optimal_price_ext_id_list_bid: [], // 明盘最优价格对应的报价 id list bid方向
//       optimal_price_ext_id_list_ofr: [] // 明盘最优价格对应的报价 id list ofr方向
//     };
//   });

//   const result = getCopyQuotesContent(quotesForCopy, ProductPanelTableKey.Optimal, undefined, true);
//   const copyContent = result.join('\n');

//   window.Main.copy(copyContent);
// };
