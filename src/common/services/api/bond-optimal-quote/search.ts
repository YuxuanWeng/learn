import cx from 'classnames';
import { FRTypeShortMap, OptionTypeStringMap } from '@fepkg/business/constants/map';
import { hasOption } from '@fepkg/business/utils/bond';
import { SERVER_NIL } from '@fepkg/common/constants';
import { fixFloatDecimal } from '@fepkg/common/utils';
import { transform2DateContent } from '@fepkg/common/utils/date';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondOptimalQuoteSearch } from '@fepkg/services/types/bond-optimal-quote/search';
import { BondOptimalQuote, FiccBondBasic, QuoteLite } from '@fepkg/services/types/common';
import { BondQuoteType, LiquidationSpeedTag, ProductType, Side } from '@fepkg/services/types/enum';
import axios from 'axios';
import { isNil, pick, uniqBy } from 'lodash-es';
import moment from 'moment';
import request from '@/common/request';
import { transform2CommentContent } from '@/common/services/api/bond-quote/search';
import { getCouponRateCurrent, getRestDayNum } from '@/common/utils/bond';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { logDataError } from '@/common/utils/logger/data';
import { isNotIntentional } from '@/common/utils/quote-price';
import { DeepQuoteTableColumn } from '@/components/DeepQuote/types';
import { CommentFlagKeys, Exercise, Maturity } from '@/components/Quote/types';
import { getCommentFlagLabel } from '@/components/Quote/utils';
import { CommentInputFlagValue } from '@/components/business/CommentInput';
import { OptimalTableColumn, OptimalTableSideInfo } from '@/pages/ProductPanel/components/OptimalTable/types';
import {
  completion2Array,
  getCpSpanColor,
  transform2ConversionRate,
  transform2PVBP,
  transform2PriceContent,
  transform2RepaymentMethod,
  transform2SpreadContent,
  transform2ValModifiedDuration
} from '@/pages/ProductPanel/utils';

export const getSideComment = (
  optimalQuoteList: DeepQuoteTableColumn[],
  otherQuoteList: DeepQuoteTableColumn[],
  productType: ProductType,
  bondInfo?: FiccBondBasic
) => {
  /**
   * 利率：只显示明盘最优备注
   * 信用：显示明盘+暗盘最优备注
   */
  let comment = '';

  const quotes = [...optimalQuoteList, ...otherQuoteList];

  let quoteList: DeepQuoteTableColumn[] = [...optimalQuoteList];

  // 暗盘最优数
  const intOptimalQuoteList = quotes.filter(v => v.original.flag_internal);
  // 明盘最优数
  const extOptimalQuoteList = quotes.filter(v => !v.original.flag_internal);

  // 取明盘最优的第一条数据的价格，显示所有与其价格相等的所有报价
  const optimal = quoteList[0]?.original;
  const optPrice = optimal?.clean_price;
  const isInternal = !!optimal?.flag_internal;

  let firstQuote: QuoteLite;
  let filterList: DeepQuoteTableColumn[] = [];

  switch (productType) {
    case ProductType.BNC:
      // 只有暗盘无明盘时，备注提示框展示暗盘的标签备注信息
      if (!extOptimalQuoteList.length) {
        firstQuote = intOptimalQuoteList[0]?.original ?? {};
        filterList = intOptimalQuoteList;
      } else {
        // 其余情况，只展示明盘上的所有最优的报价信息
        firstQuote = extOptimalQuoteList[0]?.original ?? {};
        filterList = extOptimalQuoteList;
      }
      quoteList = filterList.filter(v => {
        const { clean_price, flag_internal, flag_rebate, return_point } = v.original;
        if (firstQuote.clean_price !== SERVER_NIL) return firstQuote.clean_price === clean_price;
        // 无价场景: 平价反 > 无价 + 返点 > 意向价
        return (
          firstQuote.flag_internal === flag_internal &&
          firstQuote.flag_rebate === flag_rebate &&
          firstQuote.return_point === return_point
        );
      });

      break;
    case ProductType.BCO:
    case ProductType.NCD:
      quoteList = [...optimalQuoteList];
      quoteList = quoteList.filter(v => {
        const extOptimalQuote = v.original;
        const extOptimalPrice = extOptimalQuote.clean_price;

        const priceIsEqual =
          optimal.flag_intention === extOptimalQuote.flag_intention &&
          optimal.flag_rebate === extOptimalQuote.flag_rebate &&
          optimal.return_point === extOptimalQuote.return_point;

        if (optPrice === undefined || optPrice === SERVER_NIL) {
          if (!isInternal) return priceIsEqual && !extOptimalQuote.flag_internal;
          return priceIsEqual;
        }

        if (!isInternal) return optPrice === extOptimalPrice && !extOptimalQuote.flag_internal;
        return optPrice === extOptimalPrice;
      });
      break;
    default:
      return '';
  }

  quoteList?.forEach((item, i) => {
    const quote = item.original;
    if (i > 0) comment += ' + ';
    if (quote.volume <= 0) comment += '--';
    else comment += quote.volume;

    const hasCommentFlags = Object.values(pick(quote, CommentFlagKeys)).some(v => !!v);
    const hasBrackets = !!(
      quote.flag_oco ||
      quote.flag_package ||
      quote.flag_exchange ||
      quote.liquidation_speed_list?.filter(v => v.tag !== LiquidationSpeedTag.Default)?.length ||
      hasCommentFlags ||
      quote.comment ||
      (quote.exercise_manual && hasOption(bondInfo))
    );
    if (hasBrackets) comment += '（';
    if (quote.flag_star === 1) {
      comment += ' *';
    } else if (quote.flag_star === 2) {
      comment += ' **';
    }
    if (quote.flag_oco) comment += ' OCO';
    if (quote.flag_package) comment += ' 打包';
    if (quote.flag_exchange) comment += ' 换券';
    if (quote.liquidation_speed_list)
      comment += ` ${formatLiquidationSpeedListToString(quote.liquidation_speed_list, 'MM.DD')}`;
    const flagsLabel = getCommentFlagLabel(pick(quote, CommentFlagKeys) as CommentInputFlagValue);
    if (flagsLabel) comment += ` ${flagsLabel}`;
    if (quote.comment) comment += ` ${quote.comment}`;
    if (quote.exercise_manual && hasOption(bondInfo)) {
      if (quote.is_exercise) comment += ` ${Exercise.label}`;
      else comment += ` ${Maturity.label}`;
    }
    if (hasBrackets) comment += ' ）';
  });

  return comment;
};

export const transform2DeepQuoteTableColumn = (
  original: QuoteLite,
  isOther?: boolean,
  bond_info?: FiccBondBasic
): DeepQuoteTableColumn => {
  const { volume, broker_info, inst_info, trader_info } = original;

  const recommendCls = cx(original.flag_recommend && 'bg-orange-500');
  const volumeContent = transform2PriceContent(volume);
  const comment = transform2CommentContent(original, bond_info);
  const brokerName = broker_info?.name_zh ?? '';
  const instName = inst_info?.short_name_zh ?? '';

  const traderName = trader_info?.name_zh ?? '';
  let cp = instName;
  if (traderName) cp += `(${traderName})`;

  return {
    original,
    recommendCls,
    volume: volumeContent,
    comment,
    brokerName,
    instName,
    traderName,
    cp,
    isOther
  };
};

export const MAX_OFFSET_DEFAULT_VALUE = 65535;
export const MIN_OFFSET_DEFAULT_VALUE = -65536;

/**
 * 获取该方向上偏离值的展示内容
 * @param offset 该方向后端返回的偏离值
 * @param optimalQuote 该方向的最优报价
 */
export const getSideOffset = (offset: number, optimalQuote?: QuoteLite, bond_info?: FiccBondBasic) => {
  if (offset === MAX_OFFSET_DEFAULT_VALUE || offset === MIN_OFFSET_DEFAULT_VALUE) return '--';

  if (
    optimalQuote?.quote_type === BondQuoteType.Yield &&
    optimalQuote?.yield > 0 &&
    (bond_info?.val_yield_mat !== SERVER_NIL || bond_info?.val_yield_exe !== SERVER_NIL)
  ) {
    return fixFloatDecimal(offset, 4).toString();
  }
  return '--';
};

export const getSideInfo = (
  side: Side,
  productType: ProductType,
  original: BondOptimalQuote,
  brokerIdList: string[]
): OptimalTableSideInfo => {
  const { bond_basic_info: bond_info } = original;
  const {
    quote_bid_list,
    optimal_price_id_list_bid,
    quote_id_ext_bid,
    quote_id_int_bid,
    price_ext_bid,
    price_int_bid,
    clean_price_ext_bid,
    clean_price_int_bid,
    volume_ext_bid,
    volume_int_bid,
    offset_bid
  } = original;
  const {
    quote_ofr_list,
    optimal_price_id_list_ofr,
    quote_id_ext_ofr,
    quote_id_int_ofr,
    price_ext_ofr,
    price_int_ofr,
    clean_price_ext_ofr,
    clean_price_int_ofr,
    volume_ext_ofr,
    volume_int_ofr,
    offset_ofr
  } = original;

  let optimalQuote: QuoteLite | undefined;
  let optimalQuoteList: DeepQuoteTableColumn[] = [];
  let otherQuoteList: DeepQuoteTableColumn[] = [];
  let extOptimalQuote: QuoteLite | undefined;
  let intOptimalQuote: QuoteLite | undefined;

  let intShowOptimal = true;
  if (productType === ProductType.BNC) intShowOptimal = false;

  let extBatter = false;
  let intBatter = false;
  let priceBothEqual = false;

  let extPrice = 0;
  let intPrice = 0;

  let extVolNum = 0;
  let intVolNum = 0;

  let fullPrice = '';
  let cleanPrice = '';
  let spread = '';

  let brokerId = '';
  let brokerName = '';
  let instName = '';
  let traderId = '';
  let traderName = '';
  let cp = '';

  let offset = '--';
  let comment = '';

  let teamQuote = false;
  let teamOptimalQuote = false;

  let recommend = false;
  let isUrgent = false;
  let isSTC = false;
  let isVip = false;

  if (side === Side.SideBid) {
    optimalQuote = quote_bid_list?.[0];

    optimalQuoteList =
      quote_bid_list
        ?.filter(item => optimal_price_id_list_bid?.includes(item.quote_id))
        .map(item => transform2DeepQuoteTableColumn(item, false, bond_info)) || [];
    otherQuoteList =
      quote_bid_list
        ?.filter(item => !optimal_price_id_list_bid?.includes(item.quote_id))
        .map(item => transform2DeepQuoteTableColumn(item, true, bond_info)) || [];

    extOptimalQuote = quote_bid_list?.find(item => item.quote_id === quote_id_ext_bid);
    intOptimalQuote = quote_bid_list?.find(item => item.quote_id === quote_id_int_bid);

    intBatter = price_int_bid !== 0 && !!optimalQuote?.flag_internal;
    extBatter = price_ext_bid !== 0 && !intBatter;
    priceBothEqual =
      !isNil(clean_price_int_bid) && !isNil(clean_price_ext_bid)
        ? clean_price_int_bid === clean_price_ext_bid
        : price_int_bid !== 0 &&
          price_ext_bid !== 0 &&
          price_int_bid === price_ext_bid &&
          intOptimalQuote?.flag_rebate === extOptimalQuote?.flag_rebate &&
          intOptimalQuote?.return_point === extOptimalQuote?.return_point;

    extPrice = price_ext_bid;
    intPrice = price_int_bid;

    extVolNum = volume_ext_bid?.length ?? 0;
    intVolNum = volume_int_bid?.length ?? 0;

    if (intShowOptimal) {
      fullPrice = transform2PriceContent(optimalQuote?.full_price, true);
      cleanPrice = transform2PriceContent(optimalQuote?.clean_price, true);
      spread = transform2SpreadContent(optimalQuote?.spread, bond_info?.fr_type, optimalQuote?.yield);

      brokerId = optimalQuote?.broker_info?.broker_id ?? '';
      brokerName = optimalQuote?.broker_info?.name_zh ?? '';
      instName = optimalQuote?.inst_info?.short_name_zh ?? '';
      traderId = optimalQuote?.trader_info?.trader_id ?? '';
      traderName = optimalQuote?.trader_info?.name_zh ?? '';

      offset = getSideOffset(offset_bid, optimalQuote, bond_info);
    } else {
      // 如果明盘有报价，就取明盘最优
      // eslint-disable-next-line no-lonely-if
      if (quote_id_ext_bid !== '0') {
        fullPrice = transform2PriceContent(extOptimalQuote?.full_price, true);
        cleanPrice = transform2PriceContent(extOptimalQuote?.clean_price, true);
        spread = transform2SpreadContent(extOptimalQuote?.spread, bond_info?.fr_type, extOptimalQuote?.yield);

        brokerId = extOptimalQuote?.broker_info?.broker_id ?? '';
        brokerName = extOptimalQuote?.broker_info?.name_zh ?? '';
        instName = extOptimalQuote?.inst_info?.short_name_zh ?? '';
        traderId = extOptimalQuote?.trader_info?.trader_id ?? '';
        traderName = extOptimalQuote?.trader_info?.name_zh ?? '';

        offset = getSideOffset(offset_bid, extOptimalQuote, bond_info);
      } // 否则取暗盘最优
      else {
        fullPrice = transform2PriceContent(intOptimalQuote?.full_price, true);
        cleanPrice = transform2PriceContent(intOptimalQuote?.clean_price, true);
        spread = transform2SpreadContent(intOptimalQuote?.spread, bond_info?.fr_type, intOptimalQuote?.yield);

        brokerId = intOptimalQuote?.broker_info?.name_zh ?? '';
        brokerName = intOptimalQuote?.broker_info?.name_zh ?? '';
        instName = intOptimalQuote?.inst_info?.short_name_zh ?? '';
        traderId = intOptimalQuote?.trader_info?.trader_id ?? '';
        traderName = intOptimalQuote?.trader_info?.name_zh ?? '';

        offset = getSideOffset(offset_bid, intOptimalQuote, bond_info);
      }
    }
  } else if (side === Side.SideOfr) {
    optimalQuote = quote_ofr_list?.[0];
    optimalQuoteList =
      quote_ofr_list
        ?.filter(item => optimal_price_id_list_ofr?.includes(item.quote_id))
        .map(item => transform2DeepQuoteTableColumn(item, false, bond_info)) || [];
    otherQuoteList =
      quote_ofr_list
        ?.filter(item => !optimal_price_id_list_ofr?.includes(item.quote_id))
        .map(item => transform2DeepQuoteTableColumn(item, true, bond_info)) || [];
    extOptimalQuote = quote_ofr_list?.find(item => item.quote_id === quote_id_ext_ofr);
    intOptimalQuote = quote_ofr_list?.find(item => item.quote_id === quote_id_int_ofr);

    intBatter = price_int_ofr !== 0 && !!optimalQuote?.flag_internal;
    extBatter = price_ext_ofr !== 0 && !intBatter;
    priceBothEqual =
      !isNil(clean_price_int_ofr) && !isNil(clean_price_ext_ofr)
        ? clean_price_int_ofr === clean_price_ext_ofr
        : price_int_ofr !== 0 &&
          price_ext_ofr !== 0 &&
          price_int_ofr === price_ext_ofr &&
          intOptimalQuote?.flag_rebate === extOptimalQuote?.flag_rebate &&
          intOptimalQuote?.return_point === extOptimalQuote?.return_point;

    extPrice = price_ext_ofr;
    intPrice = price_int_ofr;

    extVolNum = volume_ext_ofr?.length ?? 0;
    intVolNum = volume_int_ofr?.length ?? 0;

    if (intShowOptimal) {
      fullPrice = transform2PriceContent(optimalQuote?.full_price, true);
      cleanPrice = transform2PriceContent(optimalQuote?.clean_price, true);
      spread = transform2SpreadContent(optimalQuote?.spread, bond_info?.fr_type, optimalQuote?.yield);

      brokerId = optimalQuote?.broker_info?.broker_id ?? '';
      brokerName = optimalQuote?.broker_info?.name_zh ?? '';
      instName = optimalQuote?.inst_info?.short_name_zh ?? '';
      traderId = optimalQuote?.trader_info?.trader_id ?? '';
      traderName = optimalQuote?.trader_info?.name_zh ?? '';

      offset = getSideOffset(offset_ofr, optimalQuote, bond_info);
    } else {
      // 如果明盘有报价，就取明盘最优
      // eslint-disable-next-line no-lonely-if
      if (quote_id_ext_ofr !== '0') {
        fullPrice = transform2PriceContent(extOptimalQuote?.full_price, true);
        cleanPrice = transform2PriceContent(extOptimalQuote?.clean_price, true);
        spread = transform2SpreadContent(extOptimalQuote?.spread, bond_info?.fr_type, extOptimalQuote?.yield);

        brokerId = extOptimalQuote?.broker_info?.broker_id ?? '';
        brokerName = extOptimalQuote?.broker_info?.name_zh ?? '';
        instName = extOptimalQuote?.inst_info?.short_name_zh ?? '';
        traderId = extOptimalQuote?.trader_info?.trader_id ?? '';
        traderName = extOptimalQuote?.trader_info?.name_zh ?? '';

        offset = getSideOffset(offset_ofr, extOptimalQuote, bond_info);
      } // 否则取暗盘最优
      else {
        fullPrice = transform2PriceContent(intOptimalQuote?.full_price, true);
        cleanPrice = transform2PriceContent(intOptimalQuote?.clean_price, true);
        spread = transform2SpreadContent(intOptimalQuote?.spread, bond_info?.fr_type, intOptimalQuote?.yield);

        brokerId = intOptimalQuote?.broker_info?.broker_id ?? '';
        brokerName = intOptimalQuote?.broker_info?.name_zh ?? '';
        instName = intOptimalQuote?.inst_info?.short_name_zh ?? '';
        traderId = intOptimalQuote?.trader_info?.trader_id ?? '';
        traderName = intOptimalQuote?.trader_info?.name_zh ?? '';

        offset = getSideOffset(offset_ofr, intOptimalQuote, bond_info);
      }
    }
  }

  cp = instName;
  if (traderName) cp += `(${traderName})`;

  comment = getSideComment(optimalQuoteList, otherQuoteList, productType, bond_info);

  teamQuote = otherQuoteList.some(quote => brokerIdList.includes(quote.original?.broker_id ?? ''));
  teamOptimalQuote = optimalQuoteList.some(quote => brokerIdList.includes(quote.original?.broker_id ?? ''));

  let isHighlight: boolean;

  /** 只有暗盘报价 */
  const onlyHasIntPrice = intPrice !== 0 && !extPrice;

  // 暗盘显示最优时，最优报价为暗盘，或若只有暗盘报价，没有明盘报价，需要高亮
  if (intShowOptimal) {
    isHighlight = intBatter || onlyHasIntPrice;
    // 推荐取明盘与暗盘最优的那条是否推荐
    recommend = !!optimalQuote?.flag_recommend;
    isUrgent = !!optimalQuote?.flag_urgent;
    isSTC = !!optimalQuote?.flag_stc;
    isVip = !!optimalQuote?.trader_info?.is_vip;
  } else {
    // 暗盘不显示最优时，若只有暗盘报价，没有明盘报价，需要高亮
    isHighlight = onlyHasIntPrice;
    // 如果有明盘，推荐取明盘最优那条的是否推荐，如果只有暗盘，取暗盘最优那条的是否推荐
    if (extOptimalQuote) {
      recommend = !!extOptimalQuote?.flag_recommend;
      isUrgent = !!extOptimalQuote?.flag_urgent;
      isSTC = !!extOptimalQuote?.flag_stc;
      isVip = !!extOptimalQuote?.trader_info?.is_vip;
    } else if (onlyHasIntPrice) {
      recommend = !!intOptimalQuote?.flag_recommend;
      isUrgent = !!intOptimalQuote?.flag_urgent;
      isSTC = !!intOptimalQuote?.flag_stc;
      isVip = !!intOptimalQuote?.trader_info?.is_vip;
    }
  }

  const textHighlighCls = isHighlight ? 'text-primary-100' : '';
  const cpHighlightCls = getCpSpanColor(isHighlight, isVip);
  const recommendCls = recommend ? '!bg-orange-500' : '';

  return {
    optimalQuote,
    optimalQuoteList,
    otherQuoteList,
    extOptimalQuote,
    intOptimalQuote,
    intShowOptimal,
    extBatter,
    intBatter,
    priceBothEqual,
    extPrice,
    intPrice,
    extVolNum,
    intVolNum,
    brokerId,
    brokerName,
    instName,
    traderId,
    traderName,
    cp,
    fullPrice,
    cleanPrice,
    spread,
    offset,
    comment,
    teamQuote,
    teamOptimalQuote,
    cpHighlightCls,
    textHighlighCls,
    recommendCls,
    isUrgent,
    isSTC
  };
};

export const transform2OptimalTableColumn = (
  productType: ProductType,
  original: BondOptimalQuote,
  brokerIdList: string[]
): OptimalTableColumn => {
  const { bond_basic_info: bond_info, update_time } = original;

  const restDayNum = getRestDayNum(bond_info?.rest_day_to_workday);
  const listed = isNotIntentional(bond_info.mkt_type);
  const weekendDay = ['日', undefined, undefined, undefined, undefined, undefined, '六'][
    moment(Number(bond_info.maturity_date)).day()
  ];
  const frType = FRTypeShortMap[bond_info.fr_type];
  const updateTime = transform2DateContent(update_time, 'HH:mm:ss');
  const bidInfo = getSideInfo(Side.SideBid, productType, original, brokerIdList);
  const ofrInfo = getSideInfo(Side.SideOfr, productType, original, brokerIdList);
  const optionType = bond_info?.option_type != undefined ? OptionTypeStringMap[bond_info.option_type] : '';
  const listedDate = transform2DateContent(bond_info?.listed_date);
  const repaymentMethod = transform2RepaymentMethod(bond_info?.repayment_method);
  const valModifiedDuration = transform2ValModifiedDuration(bond_info?.val_modified_duration);
  const maturityDate = transform2DateContent(bond_info?.maturity_date);
  const conversionRate = transform2ConversionRate(bond_info?.conversion_rate);
  const showContent =
    !!bidInfo?.optimalQuoteList?.length ||
    !!bidInfo?.otherQuoteList?.length ||
    !!ofrInfo?.optimalQuoteList?.length ||
    !!ofrInfo?.otherQuoteList?.length;
  const recommendCls = bidInfo.recommendCls || ofrInfo.recommendCls;

  const { optimalQuoteList: bidOptimalQuotes = [], otherQuoteList: bidOtherQuotes = [] } = bidInfo;
  const { optimalQuoteList: ofrOptimalQuotes = [], otherQuoteList: ofrOtherQuotes = [] } = ofrInfo;

  const [bidOptimalQuoteList, ofrOptimalQuoteList] = completion2Array(bidOptimalQuotes, ofrOptimalQuotes, undefined);
  const [bidOtherQuoteList, ofrOtherQuoteList] = completion2Array(bidOtherQuotes, ofrOtherQuotes, undefined);

  const couponRateCurrent = getCouponRateCurrent(bond_info);

  const pvbp = transform2PVBP(bond_info?.val_basis_point_value);

  return {
    original,
    restDayNum,
    listed,
    weekendDay,
    frType,
    updateTime,
    bidInfo: {
      ...bidInfo,
      optimalQuoteList: bidOptimalQuoteList.map((v, i) => {
        if (!v)
          return {
            original: { quote_id: `${(ofrOptimalQuoteList[i] as DeepQuoteTableColumn).original.quote_id}_opt_bid` }
          };
        return v;
      }),
      otherQuoteList: bidOtherQuoteList.map((v, i) => {
        if (!v)
          return {
            original: {
              quote_id: `${(ofrOtherQuoteList[i] as DeepQuoteTableColumn).original.quote_id}_oth_bid`
            },
            isOther: true
          };
        return { ...v, isOther: true };
      })
    },
    ofrInfo: {
      ...ofrInfo,
      optimalQuoteList: ofrOptimalQuoteList.map((v, i) => {
        if (!v)
          return {
            original: {
              quote_id: `${(bidOptimalQuoteList[i] as DeepQuoteTableColumn).original.quote_id}_opt_ofr`
            }
          };
        return v;
      }),
      otherQuoteList: ofrOtherQuoteList.map((v, i) => {
        if (!v)
          return {
            original: {
              quote_id: `${(bidOtherQuoteList[i] as DeepQuoteTableColumn).original.quote_id}_oth_ofr`
            },
            isOther: true
          };
        return { ...v, isOther: true };
      })
    },
    optionType,
    listedDate,
    repaymentMethod,
    valModifiedDuration,
    maturityDate,
    conversionRate,
    showContent,
    recommendCls,
    bondCode: bond_info.display_code,
    couponRateCurrent,
    pvbp
  };
};

export type FetchBondOptimalQuoteParams = {
  /** 筛选项 */
  params: BondOptimalQuoteSearch.Request;
  /** broker Id 列表 */
  brokerIdList: string[];
  /** 筛选项是否发生了变化 */
  paramsChanged?: boolean;
  /** requestConfig request 配置项 */
  requestConfig?: RequestConfig;
};

/**
 * @description 通过筛选条件获取最优报价
 * @url /api/v1/bdm/bds/bds_api/bond_optimal_quote/search
 */
export const fetchBondOptimalQuote = async ({
  params,
  brokerIdList,
  paramsChanged = true,
  requestConfig
}: FetchBondOptimalQuoteParams) => {
  const api = APIs.bondOptimalQuote.search;

  let traceId = '';
  try {
    const {
      optimal_quote_list = [],
      total,
      base_response
    } = await request.post<BondOptimalQuoteSearch.Response>(api, params, requestConfig);
    traceId = base_response?.trace_id ?? '';

    const uniqQuotes = uniqBy(optimal_quote_list, val => val.bond_basic_info?.code_market);

    // 如果有重复数据
    if (uniqQuotes.length !== optimal_quote_list.length) {
      logDataError({ api, logName: 'data-duplication', traceId });
    }

    /** Bond Info 不为空对象总数 */
    const bondInfoTotal = uniqQuotes?.filter(
      ({ bond_basic_info: bond_info }) => !!bond_info && Object.keys(bond_info).length > 0
    ).length;
    // 如果 Bond Info 的总数与返回的列表数量不相等，说明有返回了空的 BondInfo
    if (bondInfoTotal !== optimal_quote_list.length) {
      logDataError({ api, logName: 'bond-info-null', traceId });
    }

    return {
      list: uniqQuotes.map(item => transform2OptimalTableColumn(params.product_type, item, brokerIdList)),
      total
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logDataError({ api, logName: 'request-fail', traceId, error });
    } else {
      logDataError({ api, logName: 'transform-fail', traceId, error });
    }

    // 如果筛选项发生了变化，无论发生什么错误，清空 UI 列表
    if (paramsChanged) {
      return { list: [], total: 0 };
    }

    // 反之，无论发生什么错误，不清空 UI 列表
    throw new Error('fetchBondOptimalQuote has error but params not changed.');
  }
};
