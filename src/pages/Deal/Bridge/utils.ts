import { padDecimal } from '@fepkg/common/utils';
import { formatDate } from '@fepkg/common/utils/date';
import {
  Counterparty,
  FiccBondBasic,
  InstitutionTiny,
  LiquidationSpeed,
  ReceiptDeal,
  ReceiptDealDetail,
  TraderLite
} from '@fepkg/services/types/common';
import {
  BondCategory,
  BondQuoteType,
  ExerciseType,
  LiquidationSpeedTag,
  SettlementLabel
} from '@fepkg/services/types/enum';
import moment from 'moment';
import { formatPrice } from '@/common/utils/copy';
import { matchInternalCode } from '@/common/utils/internal-code';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { ReceiptDealDetailForAdd } from '@/pages/Spot/utils/type';
import { BridgeReceiptDealListFilter, TypePrice } from './types';

/**
 * 获取地方债券类型
 */
export const getLGBType = (bond?: FiccBondBasic) => {
  if (!bond || bond.bond_category !== BondCategory.LGB) return '';
  if (bond.fund_objective_sub_category === '一般债券') return '一般债';
  if (bond.fund_objective_sub_category === '普通专项') return '普通专项债';
  return bond.fund_objective_category?.replace('专项', '');
};

const getPriceStr = (price: number, prefix = '') => {
  if (price > 0) {
    return padDecimal(price) + prefix;
  }
  return '';
};

/**
 * 获取成交价  price已经是后端计算好的，净价全价，收益率等都是使用price 如果使用其他字段会有精度问题
 */
export const getPrice = (data: TypePrice) => {
  const { price_type, exercise_type, price = 0, return_point = 0, exercise_manual } = data;
  let str = '';
  switch (price_type) {
    /** 净价 */
    case BondQuoteType.CleanPrice:
      str = getPriceStr(price, '净价');
      break;
    /** 全价 */
    case BondQuoteType.FullPrice:
      str = getPriceStr(price, '全价');
      break;
    /** 收益率 */
    case BondQuoteType.Yield:
      if (price > 0 && return_point > 0) {
        str = getPriceStr(price, `F${getPriceStr(return_point)}`);
      } else {
        str = getPriceStr(price);
      }
      break;
    default:
      str = getPriceStr(price);
  }
  if (str) {
    /*
     * 报价方式如果是收益率，那么就需要标注收益率类型是按行权还是按到期。非含权债只会按到期，含权债可以是按按行权或按到期。在报价数据中，会标注是默认、行权、到期。
     * 如果标注的不是默认，价的表现形式就应该是：3.25F0.05行权   3.25F0.05到期
     */
    if (exercise_manual && exercise_type === ExerciseType.Exercise) {
      str += '行权';
    } else if (exercise_manual && exercise_type === ExerciseType.Expiration) {
      str += '到期';
    }
  }
  return str;
};

/**
 * 获取成交量
 */
export const getVolume = (volume: number) => {
  let num: number | string = volume;
  if (volume && volume >= 10000) num = `${volume / 10000}E`;
  return num;
};

export const getTradeDateStr = (traded_date: string) => {
  if (traded_date) return moment(Number(traded_date)).format('MM.DD');
  return '';
};

/**
 *
 * @param settlement_type 交割方式
 * @param traded_date 交易日毫秒时间戳
 * 返回 交易日和交割方式的格式 08.26+0，（交易日是今天的不展示日期，+0/+1）
 */
export const getSettlementTypeStr = (settlement_type: LiquidationSpeed, traded_date?: string) => {
  const settlementType = `+${settlement_type.offset}`;

  if (
    settlement_type.tag === LiquidationSpeedTag.Today ||
    ((traded_date ?? settlement_type.date) &&
      moment(Number(traded_date ?? settlement_type.date)).isSame(moment(), 'day'))
  )
    return settlementType;
  const tradeDate = formatDate(traded_date, 'MM.DD');
  return tradeDate + settlementType;
};

export const getSettlementStrWithFlagExchange = (
  liquidationSpeed: LiquidationSpeed,
  traded_date?: string,
  flag_stock_exchange?: boolean
) => {
  if (flag_stock_exchange) {
    return formatDate(traded_date, 'MM.DD');
  }
  return getSettlementTypeStr(liquidationSpeed, traded_date);
};

export const tabList = [
  { key: SettlementLabel.SettlementLabelToday, label: '今日' },
  { key: SettlementLabel.SettlementLabelTomorrow, label: '明日' },
  { key: SettlementLabel.SettlementLabelOther, label: '其他' }
];

export const convertToCounterParty = (inst?: InstitutionTiny, trader?: TraderLite) => {
  return {
    inst,
    trader
  } as Counterparty;
};

export type BridgeReceiptDealSum = {
  items: ReceiptDealDetail[];
  volume: number;
  isOfr: boolean;
  index: number[];
  latestItem: ReceiptDealDetail;
};

export const getRebateText = (deal: ReceiptDeal) =>
  deal.price_type === BondQuoteType.Yield && deal.flag_rebate && deal.return_point && deal.return_point > 0
    ? `F${deal.return_point}`
    : '';

export const getSum = (list: ReceiptDealDetail[]) => {
  const resultMap: Record<string, BridgeReceiptDealSum> = {};

  const getKey = (item: ReceiptDealDetail) => {
    const bondKey = item.parent_deal.bond_basic_info.key_market;
    const instKeys = [
      item.parent_deal.ofr_trade_info.inst == null ? undefined : `${item.parent_deal.ofr_trade_info.inst?.inst_id}_ofr`,
      item.parent_deal.bid_trade_info.inst == null ? undefined : `${item.parent_deal.bid_trade_info.inst?.inst_id}_bid`
    ];

    const rebateText = getRebateText(item.parent_deal);

    const priceKey = `${item.parent_deal.price}${rebateText}`;

    const liquidationKey = formatLiquidationSpeedListToString(item.parent_deal.liquidation_speed_list ?? []);

    return instKeys.map(k => (k == null ? undefined : `${k}_${bondKey}_${priceKey}_${liquidationKey}`));
  };

  const appendKey = (key: string, deal: ReceiptDealDetail, isOfr: boolean, index: number) => {
    if (resultMap[key] == null) {
      resultMap[key] = { items: [deal], volume: 0, isOfr, index: [], latestItem: deal };
    }

    resultMap[key].volume += deal.parent_deal.volume ?? 0;
    resultMap[key].index.push(index + 1);
    resultMap[key].items.push(deal);

    if (Number(deal.parent_deal.update_time) > Number(resultMap[key].latestItem.parent_deal.update_time)) {
      resultMap[key].latestItem = deal;
    }
  };

  list.forEach((item, index) => {
    const keys = getKey(item);
    const ofrKey = keys[0];
    const bidKey = keys[1];

    if (ofrKey != null) {
      appendKey(ofrKey, item, true, index);
    }
    if (bidKey != null) {
      appendKey(bidKey, item, false, index);
    }
  });

  return Object.values(resultMap);
};

export const getRelatedBridgeInstIds = (deal?: ReceiptDealDetailForAdd) => {
  if (deal == null) return [];
  const result = new Set<string>();

  deal.details?.forEach(d => {
    result.add(d.bid_trade_info.inst?.inst_id ?? '');
    result.add(d.ofr_trade_info.inst?.inst_id ?? '');
  });

  return [...result];
};

export const searchFilterMatch = (params: BridgeReceiptDealListFilter, item: ReceiptDealDetail) => {
  const hasBond = params.bondKeyMarket != null;
  const isBondMatch = !hasBond || item.parent_deal.bond_basic_info.key_market === params.bondKeyMarket;

  const hasPrice = params.price != null && params.price !== '';
  const isPriceMatch = !hasPrice || formatPrice(item.parent_deal.price, 4).includes(params.price ?? '');

  const hasInternalCode = params.internalCode != null && params.internalCode !== '';
  const isInternalCodeMatch =
    !hasInternalCode || matchInternalCode(item.parent_deal.internal_code ?? '', params.internalCode);

  return isBondMatch && isPriceMatch && isInternalCodeMatch && (hasBond || hasPrice || hasInternalCode);
};
