import { ListedMarketMap, transformProductType } from '@fepkg/business/constants/map';
import { SERVER_NIL } from '@fepkg/common/constants';
import {
  BondDetailSync,
  BridgeInfo,
  Broker,
  Counterparty,
  DealInfoSync,
  DealQuote,
  DealRecord,
  FiccBondBasic,
  InstSync,
  Institution,
  InstitutionTiny,
  LiquidationSpeed,
  OldContent,
  OldContentSync,
  Product,
  QuoteDraftMessageSync,
  QuoteSync,
  Trader,
  TraderLite,
  TraderSync,
  User,
  UserLite,
  UserSync
} from '@fepkg/services/types/common';
import {
  AccountStatus,
  BondDealStatus,
  BondQuoteType,
  DealType,
  DistrictType,
  InstStatus,
  JobStatus,
  LiquidationSpeedTag,
  ProductMarkType,
  RegionLevel,
  Side,
  TraderUsageStatus,
  UsageStatus
} from '@fepkg/services/types/enum';
import { InstTraderDb } from 'app/packages/database-client/types';
import { BridgeInfoSync, QuoteDraftDetail, QuoteDraftMessage } from 'app/types/DataLocalization/local-common';
import { toInteger } from 'lodash-es';
import {
  isDefaultOrToday1Tomorrow0Liquidation,
  isFRALiquidation,
  liquidationDateToTag
} from '@packages/utils/liq-speed';
import BitOper from '@/common/utils/bit';
import { SpotDate } from '@/components/IDCSpot/types';
import { SortField, SortType } from './common';

const MAX_LENGTH = 100;

/**
 * 报价条目要根据（紧急无星>紧急单星>紧急双星>非紧急无星>非紧急单星>非紧急双星，时间）重新进行排序
 */
const sortSamePriceQuote = (bondQuoteI: DealQuote, bondQuoteJ: DealQuote) => {
  // 是否加急 且 有星号
  if (bondQuoteI.flag_urgent && !bondQuoteJ.flag_urgent) {
    return SERVER_NIL;
  }
  if (bondQuoteI.flag_urgent === bondQuoteJ.flag_urgent) {
    // 加急状态相同 比较 星号（从小到大）
    if ((bondQuoteI.flag_star ?? 0) < (bondQuoteJ.flag_star ?? 0)) {
      return SERVER_NIL;
    }
    if (bondQuoteI.flag_star === bondQuoteJ.flag_star) {
      // 价格相同， 加急&星号相同 => 比较时间
      if (toInteger(bondQuoteI.update_time) < toInteger(bondQuoteJ.update_time)) {
        return SERVER_NIL;
      }
      return 0;
    }
  }
  return 1;
};

function compareQuote(bondQuoteI: DealQuote, bondQuoteJ: DealQuote, sortField: SortField, sortType: SortType): boolean {
  let tempPrice = 0;
  let midPrice = 0;
  switch (sortField) {
    case SortField.SortYield:
      tempPrice = bondQuoteI.yield ?? SERVER_NIL;
      midPrice = bondQuoteJ.yield ?? SERVER_NIL;
      break;
    case SortField.SortClearPrice:
      tempPrice = bondQuoteI.clean_price ?? SERVER_NIL;
      midPrice = bondQuoteJ.clean_price ?? SERVER_NIL;
      break;
    case SortField.SortFullPrice:
      tempPrice = bondQuoteI.full_price ?? SERVER_NIL;
      midPrice = bondQuoteJ.full_price ?? SERVER_NIL;
      break;
    case SortField.SortReturnPoint:
      tempPrice = bondQuoteI.return_point ?? SERVER_NIL;
      midPrice = bondQuoteJ.return_point ?? SERVER_NIL;
      break;
    default:
  }
  let priceBool: boolean;

  if (sortType === SortType.SortTypeAsc) {
    // 小 到 大
    priceBool = tempPrice < midPrice;
  } else {
    // 大 到 小
    priceBool = tempPrice > midPrice;
  }
  if (priceBool) {
    return true; // 第一层比较 => 价格排序根据字段选择  顺序根据 sortType (从小 到 大) || (大 到 小)
  }
  // 第二层比较 => 价格相同 => 加急&星号
  if (tempPrice === midPrice && sortSamePriceQuote(bondQuoteI, bondQuoteJ) === SERVER_NIL) {
    return true;
  }
  return false;
}

function compareTime(bondQuoteI: DealQuote, bondQuoteJ: DealQuote, sortField: SortField, sortType: SortType): boolean {
  let tempTime = 0;
  let midTime = 0;
  switch (sortField) {
    case SortField.SortCreateTime:
      tempTime = toInteger(bondQuoteI.create_time);
      midTime = toInteger(bondQuoteJ.create_time);
      break;
    case SortField.SortUpdateTime:
      tempTime = toInteger(bondQuoteI.update_time);
      midTime = toInteger(bondQuoteJ.update_time);
      break;
    default:
  }
  let timeBool: boolean;

  if (sortType === SortType.SortTypeAsc) {
    // 小 到 大
    timeBool = tempTime < midTime;
  } else {
    // 大 到 小
    timeBool = tempTime > midTime;
  }

  if (bondQuoteI.flag_urgent && !bondQuoteJ.flag_urgent) {
    return true; // 加急=1， 不加急=2
  }
  if (bondQuoteI.flag_urgent === bondQuoteJ.flag_urgent) {
    // 加急状态相同 比较 星号（从小到大）
    if ((bondQuoteI.flag_star ?? 0) < (bondQuoteJ.flag_star ?? 0)) {
      return true;
    }
    if (bondQuoteI.flag_star === bondQuoteJ.flag_star) {
      // 第三层比较 => 价格相同， 加急&星号相同 => 比较时间
      if (timeBool) {
        // 加急&星号相同 => 比较时间
        return true;
      }
    }
  }
  return false;
}

function quoteListSort(bondQuoteList: DealQuote[], sortField: SortField, sortType: SortType): DealQuote[] {
  return bondQuoteList.sort((i, j) => {
    switch (sortField) {
      case SortField.SortYield:
      case SortField.SortClearPrice:
      case SortField.SortFullPrice:
      case SortField.SortReturnPoint:
        return compareQuote(i, j, sortField, sortType) ? SERVER_NIL : 1;
      case SortField.SortCreateTime:
      case SortField.SortUpdateTime:
        return compareTime(i, j, sortField, sortType) ? SERVER_NIL : 1;
      default:
        return 0;
    }
  });
}

/** QuoteSort 报价排序 */
export function quoteSortOptimal(bondQuoteList: DealQuote[]): [bidQuoteList: DealQuote[], ofrQuoteList: DealQuote[]] {
  const bidClearPriceQuoteList: DealQuote[] = []; // bid 净价 越大则越优 => ClearPrice 从大到小
  const bidYieldQuoteList: DealQuote[] = []; // bid 收益率 越小则越优 => yield 从小到大
  const bidFlagRebateQuoteList: DealQuote[] = []; // bid 平价返
  const bidReturnPointQuoteList: DealQuote[] = []; // bid 无价+返点
  const bidIntentionQuoteList: DealQuote[] = []; // bid 意向价 更新时间越小越优 => 更新时间 从大到小

  const ofrClearPriceQuoteList: DealQuote[] = []; // 净价
  const ofrYieldQuoteList: DealQuote[] = []; // 收益率
  const ofrFlagRebateQuoteList: DealQuote[] = []; // 平价返
  const ofrReturnPointQuoteList: DealQuote[] = []; // ofr 无价+返点 越大则越优 => ReturnPoint 从大到小
  const ofrIntentionQuoteList: DealQuote[] = []; // ofr 意向价 更新时间越小越优 => 更新时间 从小到大

  for (const quoteInfo of bondQuoteList) {
    if (quoteInfo.side === Side.SideBid) {
      if (quoteInfo.clean_price !== SERVER_NIL) {
        bidClearPriceQuoteList.push(quoteInfo); // 净价
      } else if (quoteInfo.quote_type === BondQuoteType.Yield) {
        bidYieldQuoteList.push(quoteInfo); // 收益率
      } else if (quoteInfo.flag_rebate && quoteInfo.return_point === SERVER_NIL) {
        bidFlagRebateQuoteList.push(quoteInfo); // 平价返
      } else if (quoteInfo.flag_rebate && quoteInfo.return_point !== SERVER_NIL) {
        bidReturnPointQuoteList.push(quoteInfo); // 无价 + 返点
      } else {
        bidIntentionQuoteList.push(quoteInfo); // 意向价
      }
    } else if (quoteInfo.side === Side.SideOfr) {
      if (quoteInfo.clean_price !== SERVER_NIL) {
        ofrClearPriceQuoteList.push(quoteInfo); // 净价
      } else if (quoteInfo.quote_type === BondQuoteType.Yield) {
        ofrYieldQuoteList.push(quoteInfo); // 收益率
      } else if (quoteInfo.flag_rebate && quoteInfo.return_point === SERVER_NIL) {
        ofrFlagRebateQuoteList.push(quoteInfo); // 平价返
      } else if (quoteInfo.flag_rebate && quoteInfo.return_point !== SERVER_NIL) {
        ofrReturnPointQuoteList.push(quoteInfo); // 无价 + 返点
      } else {
        ofrIntentionQuoteList.push(quoteInfo); // 意向价
      }
    }
  }

  // 2.排序 & 合并排序
  // 收益率的报价>以净价报价>以全价报价

  // bid 方向
  // 合并所有 净价 > 收益率 > 平价返 > 返点 > 意向价
  const bidQuoteList: DealQuote[] = [];
  bidQuoteList.push(
    ...quoteListSort(bidClearPriceQuoteList, SortField.SortClearPrice, SortType.SortTypeDesc), // bid 净价越大越优
    ...quoteListSort(bidYieldQuoteList, SortField.SortYield, SortType.SortTypeAsc), // bid 收益率越小越优
    ...quoteListSort(bidFlagRebateQuoteList, SortField.SortUpdateTime, SortType.SortTypeAsc), // bid 平价返，比时间
    ...quoteListSort(bidReturnPointQuoteList, SortField.SortReturnPoint, SortType.SortTypeAsc), // bid 返点
    ...quoteListSort(bidIntentionQuoteList, SortField.SortUpdateTime, SortType.SortTypeAsc) // bid 意向价
  );

  // ofr 方向
  // 合并所有 净价 > 收益率 > 平价返 > 返点 > 意向价
  const ofrQuoteList: DealQuote[] = [];
  ofrQuoteList.push(
    ...quoteListSort(ofrClearPriceQuoteList, SortField.SortClearPrice, SortType.SortTypeAsc), // ofr 净价越小越优
    ...quoteListSort(ofrYieldQuoteList, SortField.SortYield, SortType.SortTypeDesc), // ofr收益率越大越优
    ...quoteListSort(ofrFlagRebateQuoteList, SortField.SortUpdateTime, SortType.SortTypeAsc), // ofr 平价返，比时间
    ...quoteListSort(ofrReturnPointQuoteList, SortField.SortReturnPoint, SortType.SortTypeDesc), // ofr 返点
    ...quoteListSort(ofrIntentionQuoteList, SortField.SortUpdateTime, SortType.SortTypeAsc) // ofr 意向价
  );

  return [bidQuoteList, ofrQuoteList];
}

/**
 *  计算idc部分最优、次优报价
 *  入参为已排好序的单个方向quoteList
 */
export function getIdcOptimalPriceQuotes(quoteList: DealQuote[]) {
  let optimalQuoteList: DealQuote[] = [];
  let subOptimalQuoteList: DealQuote[] = [];

  if (quoteList.length === 0) {
    return [optimalQuoteList, subOptimalQuoteList] as const;
  }

  // 忽略无价（有价+返点标志点亮+无返点值、平价返、无价+返点、BID/OFR）或无量的报价
  const tempQuoteList = quoteList.filter(quote => {
    if (!quote.volume || quote.volume <= 0) {
      return false; // 忽略无量
    }
    if (quote.flag_intention || (quote.flag_rebate && (!quote.return_point || quote.return_point <= 0))) {
      return false; // BID/OFR、平价返
    }
    if (quote.flag_rebate && (!quote.return_point || quote.return_point <= 0)) {
      return false; // 有价+返点标志点亮+无返点值
    }
    return quote.quote_price && quote.quote_price > 0; // 忽略无价
  });

  if (tempQuoteList.length === 0) {
    return [optimalQuoteList, subOptimalQuoteList] as const;
  }
  // 最最优报价为第一条
  const optimalQuote = tempQuoteList[0];
  let suboptimalQuote: DealQuote | undefined;

  optimalQuoteList.push(optimalQuote);

  // 债券计算器异常时，以净价报的，且净价相同，则认为同一档
  for (let index = 1; index < tempQuoteList.length; index++) {
    const quote = tempQuoteList[index];
    // 计算器正常，或以净价报价
    if (quote.clean_price && quote.clean_price > 0) {
      if (!suboptimalQuote && quote.clean_price !== tempQuoteList[index - 1].clean_price) {
        suboptimalQuote = quote; // 得到次优价
      }
      if (quote.clean_price === optimalQuote.clean_price) {
        optimalQuoteList.push(quote); // 最优价格档位
      } else if (quote.clean_price === suboptimalQuote?.clean_price) {
        subOptimalQuoteList.push(quote); // 次优价格档位
      }
    } else {
      // 计算器异常，以利率报价
      if (
        !suboptimalQuote &&
        (quote.yield !== tempQuoteList[index - 1].yield || quote.return_point !== tempQuoteList[index - 1].return_point)
      ) {
        suboptimalQuote = quote; // 得到次优价
      }
      if (quote.yield === optimalQuote.yield && quote.return_point === optimalQuote.return_point) {
        optimalQuoteList.push(quote); // 最优价格档位
      }
      if (quote.yield === suboptimalQuote?.yield && quote.return_point === suboptimalQuote?.return_point) {
        subOptimalQuoteList.push(quote); // 次优价格档位
      }
    }
  }
  optimalQuoteList = optimalQuoteList.slice(0, MAX_LENGTH);
  subOptimalQuoteList = subOptimalQuoteList.slice(0, MAX_LENGTH);
  // 得到最优和次优后再次对同一价格档位进行排序， 收益率+返点 > 收益率 > 净价
  return [optimalQuoteList, subOptimalQuoteList] as const;
}

export function quoteSortByUpdateTime(bondQuoteList: DealQuote[]): DealQuote[] {
  const bidQuoteList: DealQuote[] = [];
  const ofrQuoteList: DealQuote[] = [];

  for (const quote of bondQuoteList) {
    if (quote.side === Side.SideBid) {
      bidQuoteList.push(quote);
    } else if (quote.side === Side.SideOfr) {
      ofrQuoteList.push(quote);
    }
  }

  return [
    ...quoteListSort(bidQuoteList, SortField.SortUpdateTime, SortType.SortTypeAsc),
    ...quoteListSort(ofrQuoteList, SortField.SortUpdateTime, SortType.SortTypeAsc)
  ];
}

// 类型为 0 问题
// @ts-ignore
const SpotDateFilterMap: Record<SpotDate, (liq: LiquidationSpeed) => boolean> = {
  [BitOper.combine(SpotDate.Plus1, SpotDate.Tomorrow0)]: isDefaultOrToday1Tomorrow0Liquidation,
  [SpotDate.Plus0]: liq => liq.tag === LiquidationSpeedTag.Today && liq.offset === 0,
  [SpotDate.NonFRA]: liq => !isFRALiquidation(liq),
  [SpotDate.FRA]: isFRALiquidation
};

export const classifyGridBySpotDate = (quote: DealQuote, spotDate: SpotDate) => {
  let liqList = quote?.deal_liquidation_speed_list;
  if (!liqList?.length)
    liqList = [
      {
        tag: LiquidationSpeedTag.Default,
        offset: 0
      }
    ];
  liqList = liquidationDateToTag(liqList);
  return liqList.some(SpotDateFilterMap[spotDate]);
};

export const productCodes2ProductList = (productCodes?: string[]): Product[] | undefined => {
  if (!productCodes?.length) return void 0;
  return productCodes.map(code => ({
    product_id: '',
    product_code: code,
    product_type: 0,
    desc: '',
    display_name: '',
    color: ''
  }));
};

export const formatUserSync2Broker = (user: Partial<UserSync>): Broker => {
  return {
    broker_id: user?.user_id ?? '',
    name_zh: user?.name_cn ?? '',
    name_en: user?.name_en ?? '',
    email: user?.email ?? '',
    department: '',
    trader_count: 0,
    account: user?.account ?? '',
    product_list: productCodes2ProductList(user.product_codes),
    account_status: AccountStatus.Enable
  };
};

export const formatUserSync2User = (user: Partial<UserSync>): User => {
  return {
    user_id: user.user_id ?? '',
    job_status: JobStatus.OnJob,
    account_status: AccountStatus.Enable,
    name_cn: user.name_cn ?? '',
    name_en: user.name_en ?? '',
    account: user.account ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    telephone: user.telephone ?? '',
    job_num: user.job_num,
    QQ: user.qq ?? '',
    department_id: '',
    deleted: 1,
    qm_account: user.qm_account ?? '',
    product_list: productCodes2ProductList(user.product_codes),
    post: user.post ?? 0,
    pinyin: user.pinyin ?? '',
    pinyin_full: user.pinyin ?? ''
  };
};

export const formatUserSync2UserLite = (user: Partial<UserSync>): UserLite => {
  return {
    user_id: user.user_id ?? '',
    job_status: JobStatus.OnJob,
    account_status: AccountStatus.Enable,
    name_cn: user.name_cn ?? '',
    name_en: user.name_en ?? '',
    account: user.account ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
    telephone: user.telephone ?? '',
    job_num: user.job_num,
    QQ: user.qq ?? '',
    department_id: '',
    post: user.post ?? 0
  };
};

export const formatInstSync2Institution = (inst: Partial<InstSync>): Institution => {
  return {
    inst_id: inst.inst_id ?? '',
    standard_code: inst.standard_code ?? '',
    full_name: '',
    inst_type: { tag_id: '', type: 0, code: '', name: '', deleted: 0 },
    inst_level: { tag_id: '', type: 0, code: '', name: '', deleted: 0 },
    funds_type: { tag_id: '', type: 0, code: '', name: '', deleted: 0 },
    short_name_zh: inst.short_name_zh,
    full_name_zh: inst.full_name_zh,
    short_name_en: inst.short_name_en,
    full_name_en: inst.full_name_en,
    usage_status: UsageStatus.Using,
    biz_short_name_list: inst.product_short_name_set,
    pin_yin: inst.pinyin,
    pin_yin_full: inst.pinyin_full,
    inst_status: InstStatus.StartBiz,
    area: {
      district_id: inst.district_id ?? '',
      name: inst.district_name ?? '',
      code: '',
      level: RegionLevel.RegionLevelNone,
      parent_district_id: '',
      full_name: '',
      pinyin: '',
      deleted: 1,
      type: DistrictType.DistrictTypeNone
    }
  };
};

export const formatInstSync2InstitutionTiny = (inst: Partial<InstSync>): InstitutionTiny => {
  return {
    inst_id: inst.inst_id ?? '',
    standard_code: inst.standard_code ?? '',
    short_name_zh: inst.short_name_zh,
    full_name_zh: inst.full_name_zh,
    usage_status: UsageStatus.Using,
    biz_short_name_list: inst.product_short_name_set,
    district_id: inst.district_id,
    district_name: inst.district_name
  };
};

export const formatTraderSync2Trader = (
  trader: Partial<TraderSync>,
  inst_info?: Institution,
  broker_list?: User[]
): Trader => {
  return {
    trader_id: trader.trader_id ?? '',
    name_zh: trader.name_zh ?? '',
    name_en: trader.name_en ?? '',
    gender: 0,
    code: trader.code ?? '',
    job_status: JobStatus.OnJob,
    department: trader.department ?? '',
    position: trader.position ?? '',
    address: '',
    broker_list,
    inst_info,
    usage_status: TraderUsageStatus.TraderEnable,
    pinyin: trader.pinyin,
    pinyin_full: trader.pinyin_full,
    tags: trader.tags,
    default_broker_map: {}
  };
};

export const formatTraderSync2TraderLite = (
  trader: Partial<TraderSync>,
  product_code?: string,
  trader_tag?: string
): TraderLite => {
  return {
    trader_id: trader.trader_id ?? '',
    name_zh: trader.name_zh ?? '',
    name_en: trader.name_en ?? '',
    is_vip: product_code
      ? trader.product_marks?.some(
          m => m.product.product_code === product_code && m.marks?.some(t => t === ProductMarkType.VIP)
        ) ?? false
      : false,
    trader_tag_list: trader.tags,
    trader_tag,
    QQ: trader.qq
  };
};

export const formatQuoteSync2DealQuote = (data: {
  quote: Partial<QuoteSync>;
  inst: Partial<InstSync>;
  trader: Partial<TraderSync>;
  broker: Partial<UserSync>;
}): DealQuote => {
  const { quote, inst, trader, broker } = data;
  return {
    quote_id: quote.quote_id ?? '',
    bond_key_market: quote.bond_key_market ?? '',
    update_time: quote.update_time ?? '',
    create_time: quote.create_time ?? '',
    product_type: quote.product_type ?? 0,
    volume: quote.volume ?? SERVER_NIL,
    yield: quote.yield ?? SERVER_NIL,
    clean_price: quote.clean_price ?? SERVER_NIL,
    full_price: quote.full_price ?? SERVER_NIL,
    return_point: quote.return_point ?? SERVER_NIL,
    flag_rebate: quote.flag_rebate ?? false,
    side: quote.side ?? 0,
    quote_type: quote.quote_type ?? 0,
    liquidation_speed_list: quote.liquidation_speed_list,
    inst_info: formatInstSync2InstitutionTiny(inst),
    trader_info: formatTraderSync2TraderLite(
      trader,
      transformProductType(quote?.product_type ?? 0).en,
      quote.trader_tag
    ),
    broker_info: formatUserSync2Broker(broker),
    flag_urgent: quote.flag_urgent ?? false,
    flag_star: quote.flag_star ?? 0,
    flag_package: quote.flag_package ?? false,
    flag_oco: quote.flag_oco ?? false,
    flag_exchange: quote.flag_exchange ?? false,
    flag_stock_exchange: quote.flag_stock_exchange ?? false,
    is_exercise: quote.is_exercise ?? false,
    flag_intention: quote.flag_intention ?? false,
    flag_indivisible: quote.flag_indivisible ?? false,
    flag_stc: quote.flag_stc ?? false,
    comment: quote.comment ?? '',
    flag_internal: quote.flag_internal ?? false,
    spread: quote.spread ?? SERVER_NIL,
    quote_price: quote.quote_price ?? SERVER_NIL,
    flag_request: quote.flag_request ?? false,
    flag_bilateral: quote.flag_bilateral ?? false,
    deal_liquidation_speed_list: quote.deal_liquidation_speed_list,
    exercise_manual: quote.exercise_manual ?? false
  };
};

export const formatQuoteDraftMessageSync2QuoteDraftMessage = (data: {
  quoteDraftMessage: Partial<QuoteDraftMessageSync>;
  inst: Partial<InstSync>;
  trader: Partial<TraderSync>;
  broker: Partial<UserSync>;
  operator: Partial<UserSync>;
  creator: Partial<UserSync>;
  quote_draft_detail_list: QuoteDraftDetail[];
}): QuoteDraftMessage => {
  const { quoteDraftMessage, inst, trader, broker, operator, creator, quote_draft_detail_list } = data;

  return {
    ...quoteDraftMessage,
    message_id: quoteDraftMessage.message_id ?? '',
    quote_draft_detail_list,
    inst_info: inst.inst_id ? formatInstSync2InstitutionTiny(inst) : undefined,
    trader_info: trader.trader_id
      ? formatTraderSync2TraderLite(
          trader,
          transformProductType(quoteDraftMessage?.product_type ?? 0).en,
          quoteDraftMessage.trader_tag
        )
      : undefined,
    broker_info: broker.user_id ? formatUserSync2User(broker) : undefined,
    operator_info: operator.user_id ? formatUserSync2User(operator) : undefined,
    creator_info: creator.user_id ? formatUserSync2User(creator) : undefined
  };
};

export const formatInstTraderDb2InstTrader = (instTrader?: InstTraderDb) => {
  return {
    inst:
      instTrader &&
      formatInstSync2InstitutionTiny({
        ...instTrader,
        pinyin: instTrader.inst_pinyin,
        pinyin_full: instTrader.inst_pinyin_full,
        product_codes: JSON.parse(instTrader.inst_product_codes),
        product_short_name_set: JSON.parse(instTrader.product_short_name_set)
      }),
    trader:
      instTrader &&
      formatTraderSync2TraderLite({
        ...instTrader,
        qq: JSON.parse(instTrader.qq),
        tags: JSON.parse(instTrader.tags),
        broker_ids: JSON.parse(instTrader.broker_ids),
        white_list: JSON.parse(instTrader.white_list),
        product_marks: JSON.parse(instTrader.product_marks),
        default_broker_list: JSON.parse(instTrader.default_broker_list)
      })
  };
};

export const formatBridgeInfoSync2BridgeList = (bridge: BridgeInfoSync): BridgeInfo => {
  return {
    user: bridge.user && formatUserSync2User(bridge.user),
    trader: bridge.trader && formatTraderSync2TraderLite(bridge.trader),
    trader_tag: bridge.trader_tag,
    inst: bridge.inst && formatInstSync2InstitutionTiny(bridge.inst)
  } as BridgeInfo;
};

export const formatOldContentSync2OldContent = (data: {
  oldContent: OldContentSync;
  bidTrader?: InstTraderDb;
  ofrTrader?: InstTraderDb;
  bidBroker?: Partial<UserSync>;
  bidBrokerB?: Partial<UserSync>;
  bidBrokerC?: Partial<UserSync>;
  bidBrokerD?: Partial<UserSync>;
  ofrBroker?: Partial<UserSync>;
  ofrBrokerB?: Partial<UserSync>;
  ofrBrokerC?: Partial<UserSync>;
  ofrBrokerD?: Partial<UserSync>;
  bond?: Partial<BondDetailSync>;
}): OldContent => {
  const {
    oldContent,
    bidTrader,
    ofrTrader,
    bidBroker,
    bidBrokerB,
    bidBrokerC,
    bidBrokerD,
    ofrBroker,
    ofrBrokerB,
    ofrBrokerC,
    ofrBrokerD,
    bond
  } = data;
  const { inst: bidInstInfo, trader: bidTraderInfo } = formatInstTraderDb2InstTrader(bidTrader);
  const { inst: ofrInstInfo, trader: ofrTraderInfo } = formatInstTraderDb2InstTrader(ofrTrader);
  return {
    flag_bridge: oldContent.flag_bridge ?? false,
    bid_send_order_msg: oldContent.bid_send_order_msg,
    ofr_send_order_msg: oldContent.ofr_send_order_msg,
    bond_key_market: oldContent.bond_key_market ?? '',
    price: oldContent.price ?? -1,
    yield: oldContent.yield ?? -1,
    clean_price: oldContent.clean_price,
    full_price: oldContent.full_price,
    return_point: oldContent.return_point,
    confirm_volume: oldContent.confirm_volume ?? 0,
    flag_exchange: oldContent.flag_exchange ?? false,
    bid_trader_lite_info: bidTraderInfo,
    bid_broker_info: bidBroker ? formatUserSync2User(bidBroker) : undefined,
    ofr_trader_lite_info: ofrTraderInfo,
    ofr_broker_info: ofrBroker ? formatUserSync2User(ofrBroker) : undefined,
    deal_type: oldContent.deal_type ?? 0,
    bid_traded_date: oldContent.bid_traded_date ?? '',
    bid_delivery_date: oldContent.bid_delivery_date ?? '',
    ofr_traded_date: oldContent.ofr_traded_date ?? '',
    ofr_delivery_date: oldContent.ofr_delivery_date ?? '',
    price_type: oldContent.price_type ?? 0,
    exercise_type: oldContent.exercise_type ?? 0,
    bid_trader_tag: oldContent.bid_trader_tag,
    ofr_trader_tag: oldContent.ofr_trader_tag,
    bid_bridge_send_order_comment: oldContent.bid_bridge_send_order_comment,
    ofr_bridge_send_order_comment: oldContent.ofr_bridge_send_order_comment,
    exercise_manual: oldContent.exercise_manual,
    bid_broker_info_b: bidBrokerB ? formatUserSync2User(bidBrokerB) : undefined,
    bid_broker_info_c: bidBrokerC ? formatUserSync2User(bidBrokerC) : undefined,
    bid_broker_info_d: bidBrokerD ? formatUserSync2User(bidBrokerD) : undefined,
    ofr_broker_info_b: ofrBrokerB ? formatUserSync2User(ofrBrokerB) : undefined,
    ofr_broker_info_c: ofrBrokerC ? formatUserSync2User(ofrBrokerC) : undefined,
    ofr_broker_info_d: ofrBrokerD ? formatUserSync2User(ofrBrokerD) : undefined,
    bond_display_code: bond?.display_code,
    bond_short_name: bond?.short_name,
    bid_inst_info: bidInstInfo,
    ofr_inst_info: ofrInstInfo
  } as OldContent;
};

export const formatCounterparty = (data: {
  dealInfo: Required<DealInfoSync>;
  bidBroker?: Partial<UserSync>;
  bidBrokerB?: Partial<UserSync>;
  bidBrokerC?: Partial<UserSync>;
  bidBrokerD?: Partial<UserSync>;
  ofrBroker?: Partial<UserSync>;
  ofrBrokerB?: Partial<UserSync>;
  ofrBrokerC?: Partial<UserSync>;
  ofrBrokerD?: Partial<UserSync>;
  bidInst?: Partial<InstSync>;
  ofrInst?: Partial<InstSync>;
  bidTrader?: Partial<TraderSync>;
  ofrTrader?: Partial<TraderSync>;
  bidTraderTag: string;
  ofrTraderTag: string;
  type?: boolean;
}): Counterparty => {
  const {
    dealInfo,
    bidBroker,
    ofrBroker,
    bidInst,
    ofrInst,
    bidTrader,
    ofrTrader,
    bidTraderTag,
    ofrTraderTag,
    type,
    bidBrokerB,
    bidBrokerC,
    bidBrokerD,
    ofrBrokerB,
    ofrBrokerC,
    ofrBrokerD
  } = data;

  const bidResult = {
    inst: bidInst ? formatInstSync2InstitutionTiny(bidInst) : undefined,
    trader: bidTrader ? formatTraderSync2TraderLite(bidTrader, undefined, bidTraderTag) : undefined,
    broker: bidBroker ? formatUserSync2User(bidBroker) : undefined,
    broker_b: bidBrokerB ? formatUserSync2User(bidBrokerB) : undefined,
    broker_c: bidBrokerC ? formatUserSync2User(bidBrokerC) : undefined,
    broker_d: bidBrokerD ? formatUserSync2User(bidBrokerD) : undefined,
    flag_modify_brokerage: dealInfo.flag_bid_modify_brokerage,
    modify_brokerage_reason: dealInfo.bid_modify_brokerage_reason,
    confirm_status: dealInfo.bid_confirm_status as unknown as BondDealStatus,
    brokerage_comment: dealInfo?.bid_brokerage_comment
  };
  const ofrResult = {
    inst: ofrInst ? formatInstSync2InstitutionTiny(ofrInst) : undefined,
    trader: ofrTrader ? formatTraderSync2TraderLite(ofrTrader, undefined, ofrTraderTag) : undefined,
    broker: ofrBroker ? formatUserSync2User(ofrBroker) : undefined,
    broker_b: ofrBrokerB ? formatUserSync2User(ofrBrokerB) : undefined,
    broker_c: ofrBrokerC ? formatUserSync2User(ofrBrokerC) : undefined,
    broker_d: ofrBrokerD ? formatUserSync2User(ofrBrokerD) : undefined,
    flag_modify_brokerage: dealInfo.flag_ofr_modify_brokerage,
    modify_brokerage_reason: dealInfo.ofr_modify_brokerage_reason,
    confirm_status: dealInfo.ofr_confirm_status as unknown as BondDealStatus,
    brokerage_comment: dealInfo?.ofr_brokerage_comment
  };

  // 点价方
  if (type) {
    if (dealInfo.deal_type === DealType.TKN) return bidResult;
    return ofrResult;
  }
  // 被点价方
  if (dealInfo.deal_type === DealType.TKN) return ofrResult;
  return bidResult;
};

export const formatDealInfoSync2DealRecord = (data: {
  dealInfo: Required<DealInfoSync>;
  bondInfo?: FiccBondBasic;
  operator?: Partial<UserSync>;
  bidBroker?: Partial<UserSync>;
  bidBrokerB?: Partial<UserSync>;
  bidBrokerC?: Partial<UserSync>;
  bidBrokerD?: Partial<UserSync>;
  ofrBroker?: Partial<UserSync>;
  ofrBrokerB?: Partial<UserSync>;
  ofrBrokerC?: Partial<UserSync>;
  ofrBrokerD?: Partial<UserSync>;
  bidInst?: Partial<InstSync>;
  ofrInst?: Partial<InstSync>;
  bidTrader?: Partial<TraderSync>;
  ofrTrader?: Partial<TraderSync>;
  bidOldContentBidTrader?: InstTraderDb;
  bidOldContentOfrTrader?: InstTraderDb;
  ofrOldContentBidTrader?: InstTraderDb;
  ofrOldContentOfrTrader?: InstTraderDb;
  bidOldContentBidBroker?: Partial<UserSync>;
  bidOldContentBidBrokerB?: Partial<UserSync>;
  bidOldContentBidBrokerC?: Partial<UserSync>;
  bidOldContentBidBrokerD?: Partial<UserSync>;
  bidOldContentOfrBroker?: Partial<UserSync>;
  bidOldContentOfrBrokerB?: Partial<UserSync>;
  bidOldContentOfrBrokerC?: Partial<UserSync>;
  bidOldContentOfrBrokerD?: Partial<UserSync>;
  ofrOldContentBidBroker?: Partial<UserSync>;
  ofrOldContentBidBrokerB?: Partial<UserSync>;
  ofrOldContentBidBrokerC?: Partial<UserSync>;
  ofrOldContentBidBrokerD?: Partial<UserSync>;
  ofrOldContentOfrBroker?: Partial<UserSync>;
  ofrOldContentOfrBrokerB?: Partial<UserSync>;
  ofrOldContentOfrBrokerC?: Partial<UserSync>;
  ofrOldContentOfrBrokerD?: Partial<UserSync>;
  bidOldContentBond?: Partial<BondDetailSync>;
  ofrOldContentBond?: Partial<BondDetailSync>;
  addBidBridgeOperator?: Partial<UserSync>;
  addOfrBridgeOperator?: Partial<UserSync>;
  bridgeList?: BridgeInfoSync[];
}): DealRecord => {
  const {
    dealInfo,
    bondInfo,
    operator,
    bidBroker,
    bidBrokerB,
    bidBrokerC,
    bidBrokerD,
    ofrBroker,
    ofrBrokerB,
    ofrBrokerC,
    ofrBrokerD,
    bidInst,
    ofrInst,
    bidTrader,
    ofrTrader,
    bidOldContentBidTrader,
    bidOldContentOfrTrader,
    ofrOldContentBidTrader,
    ofrOldContentOfrTrader,
    bidOldContentBidBroker,
    bidOldContentBidBrokerB,
    bidOldContentBidBrokerC,
    bidOldContentBidBrokerD,
    bidOldContentOfrBroker,
    bidOldContentOfrBrokerB,
    bidOldContentOfrBrokerC,
    bidOldContentOfrBrokerD,
    ofrOldContentBidBroker,
    ofrOldContentBidBrokerB,
    ofrOldContentBidBrokerC,
    ofrOldContentBidBrokerD,
    ofrOldContentOfrBroker,
    ofrOldContentOfrBrokerB,
    ofrOldContentOfrBrokerC,
    ofrOldContentOfrBrokerD,
    bidOldContentBond,
    ofrOldContentBond,
    addBidBridgeOperator,
    addOfrBridgeOperator,
    bridgeList
  } = data;
  return {
    deal_id: dealInfo.deal_id,
    internal_code: dealInfo.internal_code,
    create_time: dealInfo.create_time,
    update_time: dealInfo.update_time,
    confirm_time: dealInfo.confirm_time,
    deal_type: dealInfo.deal_type,
    source: dealInfo.source,
    flag_bridge: dealInfo.flag_bridge,
    send_order_msg: dealInfo.send_order_msg,
    bid_send_order_msg: dealInfo.flag_bid_bridge_hide_comment
      ? dealInfo.bid_send_order_msg
      : dealInfo.bid_send_order_msg + dealInfo.bid_bridge_send_order_comment,
    ofr_send_order_msg: dealInfo.flag_ofr_bridge_hide_comment
      ? dealInfo.ofr_send_order_msg
      : dealInfo.ofr_send_order_msg + dealInfo.ofr_bridge_send_order_comment,
    bond_info: bondInfo,
    confirm_volume: dealInfo.confirm_volume,
    price_type: dealInfo.price_type,
    price: dealInfo.price,
    yield: dealInfo.yield,
    clean_price: dealInfo.clean_price,
    full_price: dealInfo.full_price,
    return_point: dealInfo.return_point,
    bid_settlement_type: [dealInfo.bid_settlement_type],
    bid_traded_date: dealInfo.bid_traded_date,
    bid_delivery_date: dealInfo.bid_delivery_date,
    ofr_settlement_type: [dealInfo.ofr_settlement_type],
    ofr_traded_date: dealInfo.ofr_traded_date,
    ofr_delivery_date: dealInfo.ofr_delivery_date,
    bid_bridge_record_id: dealInfo.bid_bridge_record_id,
    ofr_bridge_record_id: dealInfo.ofr_bridge_record_id,
    flag_exchange: dealInfo.flag_stock_exchange,
    exercise_type: dealInfo.exercise_type,
    deal_status: dealInfo.deal_status,
    spot_pricinger: formatCounterparty({
      dealInfo,
      bidBroker,
      bidBrokerB,
      bidBrokerC,
      bidBrokerD,
      ofrBroker,
      ofrBrokerB,
      ofrBrokerC,
      ofrBrokerD,
      bidInst,
      ofrInst,
      bidTrader,
      ofrTrader,
      bidTraderTag: dealInfo.bid_trader_tag,
      ofrTraderTag: dealInfo.ofr_trader_tag,
      type: true
    }),
    spot_pricingee: formatCounterparty({
      dealInfo,
      bidBroker,
      bidBrokerB,
      bidBrokerC,
      bidBrokerD,
      ofrBroker,
      ofrBrokerB,
      ofrBrokerC,
      ofrBrokerD,
      bidInst,
      ofrInst,
      bidTrader,
      ofrTrader,
      bidTraderTag: dealInfo.bid_trader_tag,
      ofrTraderTag: dealInfo.ofr_trader_tag,
      type: false
    }),
    spot_pricing_record_id: dealInfo.spot_pricing_record_id,
    flag_internal: dealInfo.flag_internal,
    operator: operator ? formatUserSync2User(operator) : undefined,
    listed_market: ListedMarketMap[dealInfo.listed_market],
    im_msg_text: dealInfo.im_msg_text,
    im_msg_send_status: dealInfo.im_msg_send_status,
    im_msg_record_id: dealInfo.im_msg_record_id,
    quote_id: dealInfo.quote_id,
    spot_pricing_volume: dealInfo.spot_pricing_volume,
    remain_volume: dealInfo.remain_volume,
    bid_old_content: formatOldContentSync2OldContent({
      oldContent: dealInfo.bid_old_content,
      bidTrader: bidOldContentBidTrader,
      ofrTrader: bidOldContentOfrTrader,
      bidBroker: bidOldContentBidBroker,
      bidBrokerB: bidOldContentBidBrokerB,
      bidBrokerC: bidOldContentBidBrokerC,
      bidBrokerD: bidOldContentBidBrokerD,
      ofrBroker: bidOldContentOfrBroker,
      ofrBrokerB: bidOldContentOfrBrokerB,
      ofrBrokerC: bidOldContentOfrBrokerC,
      ofrBrokerD: bidOldContentOfrBrokerD,
      bond: bidOldContentBond
    }),
    ofr_old_content: formatOldContentSync2OldContent({
      oldContent: dealInfo.ofr_old_content,
      bidTrader: ofrOldContentBidTrader,
      ofrTrader: ofrOldContentOfrTrader,
      bidBroker: ofrOldContentBidBroker,
      bidBrokerB: ofrOldContentBidBrokerB,
      bidBrokerC: ofrOldContentBidBrokerC,
      bidBrokerD: ofrOldContentBidBrokerD,
      ofrBroker: ofrOldContentOfrBroker,
      ofrBrokerB: ofrOldContentOfrBrokerB,
      ofrBrokerC: ofrOldContentOfrBrokerC,
      ofrBrokerD: ofrOldContentOfrBrokerD,
      bond: ofrOldContentBond
    }),
    bid_deal_read_status: dealInfo.bid_deal_read_status,
    ofr_deal_read_status: dealInfo.ofr_deal_read_status,
    exercise_manual: dealInfo.exercise_manual,
    hand_over_status: dealInfo.hand_over_status,
    flag_reverse_sync: dealInfo.flag_reverse_sync,
    flag_unrefer_quote: dealInfo.flag_unrefer_quote,
    flag_deal_has_changed: dealInfo.flag_deal_has_changed,
    bid_add_bridge_operator: addBidBridgeOperator ? formatUserSync2User(addBidBridgeOperator) : undefined,
    ofr_add_bridge_operator: addOfrBridgeOperator ? formatUserSync2User(addOfrBridgeOperator) : undefined,
    bridge_list: (bridgeList ?? []).map(formatBridgeInfoSync2BridgeList),
    flag_bid_pay_for_inst: dealInfo.flag_bid_pay_for_inst,
    flag_ofr_pay_for_inst: dealInfo.flag_ofr_pay_for_inst,
    product_type: dealInfo.product_type
  } as DealRecord;
};
