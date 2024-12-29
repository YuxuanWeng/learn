import cx from 'classnames';
import { FRTypeShortMap, OptionTypeStringMap } from '@fepkg/business/constants/map';
import { formatDate } from '@fepkg/common/utils/date';
import { BondOptimalQuote, FiccBondBasic, QuoteLite } from '@fepkg/services/types/common';
import { ProductType, Side } from '@fepkg/services/types/enum';
import { isNil } from 'lodash-es';
import moment from 'moment';
import { getSideComment, getSideOffset } from '@/common/services/api/bond-optimal-quote/search';
import { transform2CommentContent } from '@/common/services/api/bond-quote/search';
import { getCouponRateCurrent, getRestDayNum } from '@/common/utils/bond';
import { isNotIntentional } from '@/common/utils/quote-price';
import { OptimalTableColumn } from '@/pages/ProductPanel/components/OptimalTable/types';
import {
  getCpSpanColor,
  transform2PVBP,
  transform2PriceContent,
  transform2RepaymentMethod
} from '@/pages/ProductPanel/utils';
import { QuoteTableColumn, QuoteTableTableSideInfo } from './types';

export const transformBondTableColumn = (quoteLite: QuoteLite, bond_info: FiccBondBasic): QuoteTableColumn => {
  const { volume, broker_info, inst_info, trader_info, update_time } = quoteLite;
  const recommendCls = cx(quoteLite.flag_recommend && 'bg-orange-500');
  const volumeContent = !volume || volume < 0 ? '--' : volume.toString();
  const comment = transform2CommentContent(quoteLite, bond_info);
  const brokerName = broker_info?.name_zh ?? '';
  const instName = inst_info?.short_name_zh ?? '';
  const traderName = trader_info?.name_zh ?? '';
  let cp = instName;
  if (traderName) cp += `(${traderName})`;
  const updateTime = update_time ? formatDate(update_time, 'HH:mm:ss') : '';
  quoteLite.bond_basic_info = bond_info;

  return {
    original: quoteLite,
    recommendCls,
    volume: volumeContent,
    comment,
    brokerName,
    instName,
    traderName,
    cp,
    updateTime
  };
};

export const getSideInfo = (
  side: Side,
  productType: ProductType,
  original: BondOptimalQuote,
  brokerIdList: string[]
): QuoteTableTableSideInfo => {
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
  let optimalQuoteList: QuoteTableColumn[] = [];
  let otherQuoteList: QuoteTableColumn[] = [];
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

  let brokerName = '';
  let instName = '';
  let traderName = '';
  let cp = '';

  let offset = '--';
  let comment = '';

  let teamQuote = false;
  let teamOptimalQuote = false;

  let recommend = false;

  const { bond_basic_info: bond_info } = original;

  if (side === Side.SideBid) {
    optimalQuote = quote_bid_list?.[0];

    optimalQuoteList =
      quote_bid_list
        ?.filter(item => optimal_price_id_list_bid?.includes(item.quote_id))
        .map(item => transformBondTableColumn(item, bond_info)) || [];
    otherQuoteList =
      quote_bid_list
        ?.filter(item => !optimal_price_id_list_bid?.includes(item.quote_id))
        .map(item => transformBondTableColumn(item, bond_info)) || [];

    extOptimalQuote = quote_bid_list?.find(item => item.quote_id === quote_id_ext_bid);
    intOptimalQuote = quote_bid_list?.find(item => item.quote_id === quote_id_int_bid);

    intBatter = price_int_bid !== 0 && !!optimalQuote?.flag_internal;
    extBatter = price_ext_bid !== 0 && !intBatter;
    priceBothEqual =
      !isNil(clean_price_int_bid) && !isNil(clean_price_ext_bid) && clean_price_int_bid === clean_price_ext_bid;

    extPrice = price_ext_bid;
    intPrice = price_int_bid;

    extVolNum = volume_ext_bid?.length ?? 0;
    intVolNum = volume_int_bid?.length ?? 0;

    if (intShowOptimal) {
      brokerName = optimalQuote?.broker_info?.name_zh ?? '';
      instName = optimalQuote?.inst_info?.short_name_zh ?? '';
      traderName += optimalQuote?.trader_info?.name_zh ?? '';
    } else {
      brokerName =
        quote_id_ext_bid !== '0'
          ? extOptimalQuote?.broker_info?.name_zh ?? ''
          : intOptimalQuote?.broker_info?.name_zh ?? '';

      instName =
        quote_id_ext_bid !== '0'
          ? extOptimalQuote?.inst_info?.short_name_zh ?? ''
          : intOptimalQuote?.inst_info?.short_name_zh ?? '';

      traderName +=
        quote_id_ext_bid !== '0'
          ? extOptimalQuote?.trader_info?.name_zh ?? ''
          : intOptimalQuote?.trader_info?.name_zh ?? '';
    }

    offset = getSideOffset(offset_bid, optimalQuote);
    recommend = quote_bid_list?.some(item => item.flag_recommend) ?? false;
  } else if (side === Side.SideOfr) {
    optimalQuote = quote_ofr_list?.[0];
    optimalQuoteList =
      quote_ofr_list
        ?.filter(item => optimal_price_id_list_ofr?.includes(item.quote_id))
        .map(item => transformBondTableColumn(item, bond_info)) || [];
    otherQuoteList =
      quote_ofr_list
        ?.filter(item => !optimal_price_id_list_ofr?.includes(item.quote_id))
        .map(item => transformBondTableColumn(item, bond_info)) || [];
    extOptimalQuote = quote_ofr_list?.find(item => item.quote_id === quote_id_ext_ofr);
    intOptimalQuote = quote_ofr_list?.find(item => item.quote_id === quote_id_int_ofr);

    intBatter = price_int_ofr !== 0 && !!optimalQuote?.flag_internal;
    extBatter = price_ext_ofr !== 0 && !intBatter;
    priceBothEqual =
      !isNil(clean_price_int_ofr) && !isNil(clean_price_ext_ofr) && clean_price_int_ofr === clean_price_ext_ofr;

    extPrice = price_ext_ofr;
    intPrice = price_int_ofr;

    extVolNum = volume_ext_ofr?.length ?? 0;
    intVolNum = volume_int_ofr?.length ?? 0;

    if (intShowOptimal) {
      brokerName = optimalQuote?.broker_info?.name_zh ?? '';
      instName = optimalQuote?.inst_info?.short_name_zh ?? '';
      traderName += optimalQuote?.trader_info?.name_zh ?? '';
    } else {
      brokerName =
        quote_id_ext_ofr !== '0'
          ? extOptimalQuote?.broker_info?.name_zh ?? ''
          : intOptimalQuote?.broker_info?.name_zh ?? '';

      instName =
        quote_id_ext_ofr !== '0'
          ? extOptimalQuote?.inst_info?.short_name_zh ?? ''
          : intOptimalQuote?.inst_info?.short_name_zh ?? '';

      traderName +=
        quote_id_ext_ofr !== '0'
          ? extOptimalQuote?.trader_info?.name_zh ?? ''
          : intOptimalQuote?.trader_info?.name_zh ?? '';
    }

    offset = getSideOffset(offset_ofr, optimalQuote);
    recommend = quote_ofr_list?.some(item => item.flag_recommend) ?? false;
  }

  cp = instName;
  if (traderName) cp += `(${traderName})`;

  const fullPrice = transform2PriceContent(optimalQuote?.full_price, true);
  const cleanPrice = transform2PriceContent(optimalQuote?.clean_price, true);
  const spread = transform2PriceContent(optimalQuote?.spread);

  comment = getSideComment(optimalQuoteList, otherQuoteList, productType, bond_info);

  teamQuote = otherQuoteList.some(quote => brokerIdList.includes(quote.original?.broker_id ?? ''));
  teamOptimalQuote = optimalQuoteList.some(quote => brokerIdList.includes(quote.original?.broker_id ?? ''));

  const isVip = !!optimalQuote?.trader_info?.is_vip;

  let isHighlight: boolean;

  // 暗盘显示最优时，最优报价为暗盘，或若只有暗盘报价，没有明盘报价，需要高亮
  if (intShowOptimal) {
    isHighlight = intBatter || (intPrice !== 0 && !extPrice);
  } else {
    // 暗盘不显示最优时，若只有暗盘报价，没有明盘报价，需要高亮
    isHighlight = intPrice !== 0 && !extPrice;
  }

  const textHighlighCls = isHighlight ? 'text-primary-100' : '';
  const cpHighlightCls = getCpSpanColor(isHighlight, isVip);

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
    brokerName,
    instName,
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
    recommendCls: cx(recommend && '!bg-orange-500')
  };
};

export const transform2OptimalTableColumn = (
  productType: ProductType,
  original: BondOptimalQuote,
  brokerIdList: string[]
) => {
  const { bond_basic_info: bond_info, update_time } = original;
  const restDayNum = getRestDayNum(bond_info?.rest_day_to_workday);
  const listed = isNotIntentional(bond_info.mkt_type);
  const weekendDay = ['日', undefined, undefined, undefined, undefined, undefined, '六'][
    moment.unix(Number(bond_info.maturity_date)).day()
  ];
  const frType = FRTypeShortMap[bond_info.fr_type];
  const updateTime = update_time ? formatDate(update_time, 'HH:mm:ss') : '';
  const bidInfo = getSideInfo(Side.SideBid, productType, original, brokerIdList);
  const ofrInfo = getSideInfo(Side.SideOfr, productType, original, brokerIdList);
  const optionType = bond_info?.option_type != undefined ? OptionTypeStringMap[bond_info.option_type] : '';
  const listedDate = formatDate(bond_info?.listed_date);
  const repaymentMethod = transform2RepaymentMethod(bond_info?.repayment_method);
  const valModifiedDuration =
    // eslint-disable-next-line no-nested-ternary
    bond_info?.val_modified_duration != undefined
      ? bond_info?.val_modified_duration < 0
        ? '--'
        : bond_info.val_modified_duration.toFixed(4)
      : '';
  // eslint-disable-next-line no-nested-ternary
  const maturityDate = bond_info?.maturity_date
    ? +bond_info.maturity_date > 0
      ? formatDate(bond_info?.maturity_date)
      : ''
    : '';
  const conversionRate =
    bond_info?.conversion_rate == undefined || bond_info?.conversion_rate < 0
      ? '--'
      : bond_info?.conversion_rate.toFixed(4);
  const showContent =
    !!bidInfo?.optimalQuoteList?.length ||
    !!bidInfo?.otherQuoteList?.length ||
    !!ofrInfo?.optimalQuoteList?.length ||
    !!ofrInfo?.otherQuoteList?.length;
  const recommendCls = bidInfo.recommendCls || ofrInfo.recommendCls;

  const { optimalQuoteList: bidOptimalQuotes = [], otherQuoteList: bidOtherQuotes = [] } = bidInfo;
  const { optimalQuoteList: ofrOptimalQuotes = [], otherQuoteList: ofrOtherQuotes = [] } = ofrInfo;

  const [bidOptimalQuoteList, ofrOptimalQuoteList] = [bidOptimalQuotes, ofrOptimalQuotes];
  const [bidOtherQuoteList, ofrOtherQuoteList] = [bidOtherQuotes, ofrOtherQuotes];

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
            original: { quote_id: `${ofrOptimalQuoteList[i].original.quote_id}_opt_bid` }
          };
        return v;
      }),
      otherQuoteList: bidOtherQuoteList.map((v, i) => {
        if (!v)
          return {
            original: {
              quote_id: `${ofrOtherQuoteList[i].original.quote_id}_oth_bid`
            }
          };
        return v;
      })
    },
    ofrInfo: {
      ...ofrInfo,
      optimalQuoteList: ofrOptimalQuoteList.map((v, i) => {
        if (!v)
          return {
            original: {
              quote_id: `${bidOptimalQuoteList[i].original.quote_id}_opt_ofr`
            }
          };
        return v;
      }),
      otherQuoteList: ofrOtherQuoteList.map((v, i) => {
        if (!v)
          return {
            original: {
              quote_id: `${bidOtherQuoteList[i].original.quote_id}_oth_ofr`
            }
          };
        return v;
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

const checkedBond = (list: QuoteTableColumn[], brokerIdList: string[]) => {
  if (brokerIdList.length > 0) {
    return list.filter(item => brokerIdList.includes(item.original.broker_info?.broker_id || ''));
  }
  return list;
};

export const dataConvert = (quoteList: OptimalTableColumn[], side: Side, brokerIdList: string[]) => {
  let list: QuoteTableColumn[] = [];
  if (quoteList.length > 0) {
    const { bidInfo, ofrInfo } = quoteList[0];
    if (side === Side.SideBid && bidInfo) {
      const { optimalQuoteList, otherQuoteList } = bidInfo;
      list = [...(optimalQuoteList || []), ...(otherQuoteList || [])] as QuoteTableColumn[];
    } else if (side === Side.SideOfr && ofrInfo) {
      const { optimalQuoteList, otherQuoteList } = ofrInfo;
      list = [...(optimalQuoteList || []), ...(otherQuoteList || [])] as QuoteTableColumn[];
    }
  }
  const validList = checkedBond(list, brokerIdList);
  return {
    list: validList,
    total: validList.length
  };
};
