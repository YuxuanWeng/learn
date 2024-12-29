import { DirectionMap, SideMap } from '@fepkg/business/constants/map';
import { hasOption } from '@fepkg/business/utils/bond';
import { transformPriceContent } from '@fepkg/business/utils/price';
import { SERVER_NIL, SPACE_TEXT } from '@fepkg/common/constants';
import { padDecimal } from '@fepkg/common/utils/utils';
import { StatusCode } from '@fepkg/request/types';
import {
  FiccBondBasic,
  LiquidationSpeed,
  NotificationContent,
  OppositePriceNotification,
  OppositePriceNotifyLogic,
  QuoteHandicap
} from '@fepkg/services/types/common';
import type { LocalBondGetByKeyMarketList } from '@fepkg/services/types/data-localization-manual/bond/get-by-key-market-list';
import type { LocalTraderGetByIdList } from '@fepkg/services/types/data-localization-manual/trader/get-by-id-list';
import {
  FiccBondInfoLevelV2,
  LiquidationSpeedTag,
  OppositePriceNotifyColor,
  OppositePriceNotifyLogicType,
  ProductType,
  UserSettingFunction
} from '@fepkg/services/types/enum';
import type { BondQuoteDealHandicap } from '@fepkg/services/types/handicap/get-by-bond';
import type { OppositePriceNotificationGet } from '@fepkg/services/types/opposite-price-notification/get';
import { captureMessage } from '@sentry/electron';
import { isUndefined } from 'lodash-es';
import { isUseLocalServer } from '@/common/ab-rules';
import { fetchBondByKeyMarket } from '@/common/services/api/base-data/key-market-get';
import { fetchLocalBondByKeyMarketList } from '@/common/services/api/data-localization-manual/bond/get-by-key-market-list';
import {
  fetchLocalTraderByIdList,
  fetchTraderByIdList
} from '@/common/services/api/data-localization-manual/trader/get-by-id-list';
import { fetchLocalServerBondByKeyMarket } from '@/common/services/api/local-server/bond-get-by-key-market';
import { fetchLocalServerTraderByIdList } from '@/common/services/api/local-server/trader-get-by-id';
import { batchFetchOppositePriceNotification } from '@/common/services/api/opposite-price-notification/get';
import { fetchTraderSetting } from '@/common/services/api/opposite-price-notification/trader-setting-get';
import {
  QuoteForCopy,
  getBondName,
  getDuration,
  getFRType,
  getIssueAmount,
  getLGBType,
  getListDate,
  getMaturityDate,
  getPriceAndVolumeBothSide,
  getRating,
  getTimeToMaturity,
  getValuation,
  getWarrant
} from '@/common/utils/copy/quote';
import { formatLiquidationSpeedListToString } from '@/common/utils/liq-speed';
import { IMHelperMsgSendSingleResultForDisplay, SendMsgDetail } from '@/components/IMHelper/type';
import { Exercise, Maturity } from '@/components/Quote/types';
import { getOneUserSettingsValue } from '@/pages/Base/SystemSetting/components/QuoteSettings/utils';
import { TypeCardItem, TypeGetPriceNotificationList } from './type';

const INTERNAL = '暗盘';

export const oppositePriceNotifyColorMap: Record<OppositePriceNotifyColor, string> = {
  [OppositePriceNotifyColor.OppositePriceNotifyColorNone]: '',
  [OppositePriceNotifyColor.OppositePriceNotifyColorPrimary]: 'text-secondary-100',
  [OppositePriceNotifyColor.OppositePriceNotifyColorAuxiliary]: 'text-orange-200',
  [OppositePriceNotifyColor.OppositePriceNotifyColorOfr]: 'text-green-100',
  [OppositePriceNotifyColor.OppositePriceNotifyColorRed]: 'text-danger-100',
  [OppositePriceNotifyColor.OppositePriceNotifyColorGolden]: 'text-yellow-200',
  [OppositePriceNotifyColor.OppositePriceNotifyColorTrd]: 'text-purple-100'
};

/**
 * 递归请求所有的对价提醒信息
 * @returns OppositePriceNotification[];
 */
export const batchGetPriceNotificationList = async ({
  list = [],
  count = 100,
  offset = 0,
  product_type = ProductType.BNC
}: TypeGetPriceNotificationList) => {
  const param: OppositePriceNotificationGet.Request = { count, offset, product_type };
  const { notifications = [], has_more } = await batchFetchOppositePriceNotification(param);
  let notificationList = [...list, ...notifications];
  if (has_more) {
    notificationList = await batchGetPriceNotificationList({
      list: notificationList,
      count,
      offset: offset + count,
      product_type
    });
  }
  return notificationList;
};

/**
 *  读取本地数据库中的债券信息
 * @returns
 */
export const fetchBondListFromLocalDB = async (
  key_market_list: string[]
): Promise<{ bondBasicList: FiccBondBasic[] }> => {
  try {
    if (key_market_list.length < 1) {
      return await Promise.reject(new Error('params is invalid.'));
    }

    let value: LocalBondGetByKeyMarketList.Response;
    // 前端本地化与local server AB
    if (isUseLocalServer()) {
      value = await fetchLocalServerBondByKeyMarket({ key_market_list });
    } else {
      value = await fetchLocalBondByKeyMarketList({ key_market_list });
    }

    const { base_response } = value ?? {};

    if (base_response?.code !== StatusCode.Success) {
      captureMessage('GetBondLiteListByKeyMarketList', { extra: value });
      return await Promise.reject(new Error(base_response?.msg ?? ''));
    }
    return { bondBasicList: value.bond_list ?? [] };
  } catch {
    const res = await fetchBondByKeyMarket({
      key_market_list,
      info_level: FiccBondInfoLevelV2.InfoLevelBasic
    });
    return { bondBasicList: res.bond_basic_list ?? [] };
  }
};

/** 获取间隔时间 */
export const getIntervalTime = (updateTime = '') => {
  const intervalTime = Date.now() - Number(updateTime);
  const hour = Math.floor(intervalTime / (1000 * 60 * 60));
  const minute = Math.floor(intervalTime / (1000 * 60));
  if (updateTime === '') {
    return '';
  }
  if (minute < 1) {
    return '刚刚';
  }
  if (minute < 60) {
    return `${minute}分钟前`;
  }
  return `${hour}小时前`;
};

export const convertToCardItemList = (
  keyMarketList: string[],
  notificationMap: Map<string, OppositePriceNotification[]>,
  bondHandicapMap: Map<string, BondQuoteDealHandicap>
) => {
  const cardItemList: TypeCardItem[] = [];
  for (const item of keyMarketList) {
    cardItemList.push({
      keyMarket: item,
      notifications: notificationMap.get(item) ?? [],
      bondHandicap: bondHandicapMap?.get(item)
    });
  }

  return cardItemList;
};

/** 单个卡片的复制内容 */
export const fromCardItemToCopyMsg = (data: TypeCardItem) => {
  const { bondInfo: bond, bondHandicap } = data;
  if (bond === undefined) {
    return '';
  }
  const bidQuotes = (bondHandicap?.bid_optimal_quote ?? []) as QuoteForCopy[];
  const ofrQuotes = (bondHandicap?.ofr_optimal_quote ?? []) as QuoteForCopy[];
  const productType = bond.product_type;
  /** 复制 估值 */
  const showValuation = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeValuation);

  /** 复制 发行量 */
  const showIssueAmount = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeIssueAmount);
  /** 复制 到期日 */
  const showMaturityDate = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeMaturityDate);
  /** 复制 久期 */
  const showDuration = getOneUserSettingsValue<boolean>(UserSettingFunction.UserSettingIncludeDuration);

  /** 含暗盘 */
  const optimalHasInternal = [...ofrQuotes, ...bidQuotes].some(q => q.flag_internal);
  const bidPrice = bondHandicap?.bid_optimal_quote?.[0]?.price;
  const ofrPrice = bondHandicap?.ofr_optimal_quote?.[0]?.price;

  const priceAndVolume = getPriceAndVolumeBothSide([...ofrQuotes, ...bidQuotes], bond, productType, [
    bidPrice,
    ofrPrice
  ]);
  let result: (string | boolean | undefined)[] = [];
  // 信用
  if (productType === ProductType.BCO) {
    result = [
      optimalHasInternal && INTERNAL,
      getTimeToMaturity(bond),
      bond.short_name,
      bond.display_code,
      priceAndVolume.price,
      priceAndVolume.volume,
      getRating(bond),
      getWarrant(bond),
      getFRType(bond),
      getListDate(bond),
      showValuation && getValuation(bond),
      showDuration && getDuration(bond),
      showIssueAmount && getIssueAmount(bond),
      showMaturityDate && getMaturityDate(bond)
    ];
  }
  // 利率
  if (productType === ProductType.BNC) {
    result = [
      getTimeToMaturity(bond),
      bond.display_code,
      getBondName(bond, productType),
      priceAndVolume.price,
      priceAndVolume.volume,
      getFRType(bond),
      getListDate(bond),
      getLGBType(bond),
      showValuation && getValuation(bond),
      showDuration && getDuration(bond),
      showIssueAmount && getIssueAmount(bond),
      showMaturityDate && getMaturityDate(bond)
    ];
  }
  return result.filter(Boolean).join(SPACE_TEXT.repeat(4));
};

const getPrice = (price?: number, return_point = -1, flag_rebate?: boolean) => {
  let dealPrice = padDecimal(price ?? 0);
  if (flag_rebate) {
    dealPrice += `F${return_point > 0 ? padDecimal(return_point) : '--'}`;
  }
  return dealPrice;
};

/**
 *  读取本地数据库中的债券信息
 * @returns
 */
export const fetchTraderSyncListFromLocalDB = async (
  trader_id_list: string[]
): Promise<LocalTraderGetByIdList.Response | undefined> => {
  try {
    if (trader_id_list.length < 1) {
      return await Promise.reject(new Error('params is invalid.'));
    }

    let value: LocalTraderGetByIdList.Response;
    // 前端本地化与local server AB
    if (isUseLocalServer()) {
      value = await fetchLocalServerTraderByIdList({ trader_id_list });
    } else {
      value = await fetchLocalTraderByIdList({ trader_id_list });
    }

    const { base_response } = value ?? {};

    if (base_response?.code !== StatusCode.Success) {
      captureMessage('GetTraderSyncListByTraderIdList', { extra: value });
      return await Promise.reject(new Error(base_response?.msg ?? ''));
    }
    return value;
  } catch {
    const res = await fetchTraderByIdList({
      trader_id_list
    });
    return { trader_sync_list: res.trader_sync_list ?? [] };
    // return await Promise.reject(err);
  }
};

export const getTraderQQMap = async (cardList: TypeCardItem[]) => {
  const traderIdSet = new Set<string>();
  for (const card of cardList) {
    for (const notification of card.notifications) {
      traderIdSet.add(notification.trader_id);
    }
  }
  const res = await fetchTraderSyncListFromLocalDB([...traderIdSet]);
  const traderQQMap = new Map<string, string>();
  if (res?.trader_sync_list)
    for (const trader of res.trader_sync_list) {
      traderQQMap.set(trader.trader_id, trader.qq?.[0] ?? '');
    }
  return traderQQMap;
};

/** 获取提醒渠道管理中关闭的traderIdList */
export const getClosedTraderIdList = async (product_type: ProductType) => {
  const { trader_list = [] } = await fetchTraderSetting({ product_type });
  return trader_list.filter(trader => !trader.turn_on).map(trader => trader.trader_id);
};

/**
 * 获取发送成功的数据条数
 */
export const getMessageSuccessNum = (
  messages: SendMsgDetail[],
  resultForDisplay: IMHelperMsgSendSingleResultForDisplay[]
) => {
  const failedTraderIdList = resultForDisplay.map(item => item.trader_id);
  if (failedTraderIdList.length === 0) {
    return messages.length;
  }
  return messages.filter(item => !failedTraderIdList.includes(item.receiver_id ?? '')).length;
};

export const clearInvalidErrorMsgKey = (
  notificationList: OppositePriceNotification[],
  errorMap: Map<string, string>
) => {
  for (const notification of notificationList) {
    errorMap.delete(
      notification.bond_key_market +
        notification.inst_id +
        notification.trader_id +
        notification.quote_side +
        !!notification.flag_internal
    );
  }
};

/** 获取剩余期限第一部分的数字 */
export const getTimeToMaturityNum = (timeToMaturityStr = '') => {
  const timeToMaturity = timeToMaturityStr.split('+')[0];
  if (timeToMaturity.length === 0) {
    return 0;
  }
  let timeToMaturityNum = Number(timeToMaturity.slice(0, -1));
  if (timeToMaturity.endsWith('Y')) {
    timeToMaturityNum *= 365;
  }
  return timeToMaturityNum;
};

/** 是否是referred价格 */
export const isReferredQuote = (notification: OppositePriceNotification) => {
  const { return_point, flag_rebate, quote_price, flag_intention } = notification;
  const showFlatRateReturn =
    flag_rebate && (quote_price === undefined || quote_price <= 0) && return_point !== undefined && return_point <= 0;
  return quote_price === -1 && !flag_intention && !showFlatRateReturn;
};

/** 交割方式不是默认 */
export const liquidationSpeedIsValid = (liquidationSpeed?: LiquidationSpeed[]) => {
  return liquidationSpeed && !!liquidationSpeed.filter(v => v.tag !== LiquidationSpeedTag.Default)?.length;
};

/** 鼠标悬浮的时候展示的内容 */
export const getToolTipMsg = (quote: QuoteHandicap, bondInfo: FiccBondBasic) => {
  let comment = '';
  const {
    exercise_manual,
    is_exercise,
    volume,
    flag_star,
    flag_oco,
    flag_package,
    flag_exchange,
    flag_stock_exchange,
    flag_indivisible,
    flag_bilateral,
    flag_request,
    liquidation_speed_list,
    comment: quoteComment
  } = quote;
  const { has_option, option_type } = bondInfo;
  if (volume === undefined || volume <= 0) comment += '--';
  else comment += volume;
  // 是不是勾选了行权方式(行权和到期)
  const optionStatus = exercise_manual && hasOption({ has_option, option_type });
  const hasBrackets = !!(
    flag_star ||
    flag_oco ||
    flag_package ||
    flag_exchange ||
    flag_stock_exchange ||
    flag_indivisible ||
    flag_bilateral ||
    flag_request ||
    liquidationSpeedIsValid(liquidation_speed_list) ||
    optionStatus
  );
  if (hasBrackets) comment += ' (';
  // 标签
  if (flag_star === 1) {
    comment += ' *';
  } else if (flag_star === 2) {
    comment += ' **';
  }
  if (flag_oco) comment += ' OCO';
  if (flag_package) comment += ' 打包';
  if (flag_exchange) comment += ' 换券';
  // 清算速度
  if (liquidation_speed_list && liquidationSpeedIsValid(liquidation_speed_list))
    comment += ` ${formatLiquidationSpeedListToString(liquidation_speed_list, 'MM.DD')} `;
  if (!comment.endsWith(' ')) {
    comment += ' ';
  }
  if (flag_stock_exchange) comment += '交易所';
  if (flag_indivisible) comment += '整量';
  if (flag_bilateral) comment += '点双边';
  if (flag_request) {
    comment += '请求报价';
  }

  if (quoteComment?.length) {
    comment += ` ${quoteComment}`;
  }
  if (optionStatus) {
    if (is_exercise) comment += ` ${Exercise.label}`;
    else comment += ` ${Maturity.label}`;
  }
  if (hasBrackets) comment += ')';
  return comment;
};

/** 获取最优量 */
export const getOptimalVal = (quote: QuoteHandicap) => {
  const { volume, flag_star, liquidation_speed_list } = quote;
  const hasBrackets = liquidationSpeedIsValid(liquidation_speed_list);
  let optimalVolume = volume === undefined || volume <= 0 ? '--' : volume;
  if (hasBrackets) optimalVolume += '（';
  if (flag_star === 1) {
    optimalVolume += '*';
  } else if (flag_star === 2) {
    optimalVolume += '**';
  }
  if (liquidation_speed_list && liquidationSpeedIsValid(liquidation_speed_list))
    optimalVolume += ` ${formatLiquidationSpeedListToString(liquidation_speed_list, 'MM.DD')}`;
  if (hasBrackets) optimalVolume += '）';
  return optimalVolume;
};

export const getTooTipMsgs = (quoteList: QuoteHandicap[], bondInfo: FiccBondBasic) => {
  let msg = '';
  const { length } = quoteList;
  for (const [index, quote] of quoteList.entries()) {
    msg += getToolTipMsg(quote, bondInfo);
    if (index != length - 1) {
      msg += ' + ';
    }
  }
  return msg;
};

export const getQuoteDisplayPrice = (notification: OppositePriceNotification) => {
  const { return_point, flag_rebate, quote_price, quote_side, flag_intention } = notification;
  let priceContent = '--';
  // 是平价返

  const isUndefinedPrice = isUndefined(quote_price);
  const showFlatRateReturn =
    flag_rebate &&
    (return_point === SERVER_NIL || return_point === 0) &&
    (isUndefinedPrice || (!isUndefinedPrice && (quote_price === SERVER_NIL || quote_price === 0)));

  if (quote_price !== undefined && quote_price >= 0) {
    priceContent = transformPriceContent(quote_price);
  } else if (flag_intention) {
    // priceContent = quote_side === Side.SideBid ?'BID' : 'OFR';
    priceContent = SideMap[quote_side].upperCase;
  } else if (showFlatRateReturn) {
    priceContent = '平价返';
  }

  let returnPointContent = '';
  if (flag_rebate && !showFlatRateReturn) {
    returnPointContent =
      return_point !== undefined && return_point >= 0 ? ` F${transformPriceContent(return_point)}` : '--';
  }
  return `${priceContent}${returnPointContent}`;
};

export const getTraderPrice = (notificationList: OppositePriceNotification[]) => {
  let traderPrice = notificationList[0]?.trader_name;
  traderPrice += `(${notificationList.map(notification => getQuoteDisplayPrice(notification)).join('|')})`;
  return traderPrice;
};

export const getAllTraderPrice = (notificationsList: OppositePriceNotification[][]) => {
  let str = '';
  const { length } = notificationsList;
  for (const [index, notifications] of notificationsList.entries()) {
    str += getTraderPrice(notifications);
    if (index + 1 !== length) {
      str += ' ';
    }
  }
  return str;
};

export const getLogicMsg = (logic: OppositePriceNotifyLogic) => `${logic.msg_template}[${logic.notify_logic_name}]`;

/** 生成价格信息 */
export const getPriceMsg = (data: TypeCardItem, content?: NotificationContent) => {
  const { bondHandicap } = data;
  const priceMsg = content?.price_msg ?? '';
  const copyMsg = fromCardItemToCopyMsg(data);
  const logicType = content?.notify_logic_type;
  if (
    // 有即时成交
    logicType === OppositePriceNotifyLogicType.NotifyLogicTypeHasCurrentDeal ||
    // 有历史成交
    logicType === OppositePriceNotifyLogicType.NotifyLogicTypeHasHistDeal
  ) {
    const latestMarketDeal = bondHandicap?.latest_market_deal;
    if (latestMarketDeal === undefined) {
      return copyMsg;
    }
    const { price, direction, return_point, flag_rebate } = latestMarketDeal;
    /** 成交价格   */
    const dealPrice = getPrice(price, return_point, flag_rebate);
    /** 成交方向 */
    // const dealDirection = getDealDirection(direction);
    const dealDirection = DirectionMap[direction];
    if (logicType === OppositePriceNotifyLogicType.NotifyLogicTypeHasCurrentDeal) {
      return `${copyMsg}\n这个刚有${dealPrice}的${dealDirection}`;
    }
    return `${copyMsg}\n这个今天有${dealPrice}的${dealDirection}`;
  }
  if (
    (priceMsg.length > 0 && logicType === OppositePriceNotifyLogicType.NotifyLogicTypeWorsePriceOnOppositeSide) ||
    logicType === OppositePriceNotifyLogicType.NotifyLogicTypeNoQuoteOnOppositeSide
  ) {
    return `${copyMsg}\n${priceMsg}`;
  }
  return copyMsg;
};

export const getNotificationContent = (notification: OppositePriceNotification) => {
  return notification.notification_content?.[0];
};

/** 获取提醒信息的唯一key 同券 同机构 同交易员 同方向 同明暗
 */
export const getRemindKey = (notification: OppositePriceNotification) => {
  const { bond_key_market, inst_id, trader_id, quote_side, flag_internal = false } = notification;
  return bond_key_market + inst_id + trader_id + quote_side + flag_internal;
};
