import { LiquidationSpeedTagMap } from '@fepkg/business/constants/map';
import { getNextTradedDate } from '@fepkg/business/hooks/useDealDateMutation';
import { DateOffsetEnum } from '@fepkg/business/types/date';
import { liquidationSpeedToString } from '@fepkg/business/utils/liq-speed';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { FiccBondBasic, LiquidationSpeed } from '@fepkg/services/types/bds-common';
import { LiquidationSpeedTag, OperationType } from '@fepkg/services/types/bds-enum';
import { withCtx } from '@fepkg/trace';
import { context } from '@opentelemetry/api';
import { max, uniq } from 'lodash-es';
import moment, { Moment } from 'moment';
import { QuoteCalcType } from '@/components/Quote/types';
import {
  BatchGetTreadDayAndDeliDayProps,
  BatchGetTreadDayAndDeliDayResponse,
  ClearSpeedType,
  DateShortcuts,
  DateShortcutsEnum,
  DaysStruct,
  LiqSpeedWithMoment,
  LiqSpeedWithTradeDate,
  SettlementDate,
  SettlementMethod,
  WeekInSpeedTag,
  Weeks,
  WeeksOnService
} from '../types/liq-speed';
import { getNextWeekday } from './date';
import { logger } from './logger';

/** 根据不同的台子，获取不同的默认交易日和交割日 */
export const getDateWithProduct = (dates: DaysStruct[], productType: ProductType) => {
  const tomorrow = dates.find(item => item.key === DateShortcutsEnum.TOMORROW);
  const today = dates.find(item => item.key === DateShortcutsEnum.PLUS_0);
  const todayPlus1 = dates.find(item => item.key === DateShortcutsEnum.PLUS_1);

  const trades = uniq([formatDate(tomorrow?.tradedDate), formatDate(todayPlus1?.tradedDate)]);
  const deliveries = uniq([formatDate(tomorrow?.deliveryDate), formatDate(todayPlus1?.deliveryDate)]);

  let traded = '';
  let delivery = '';

  switch (productType) {
    // 利率默认「明天+0」和「+1」
    // 如果交易日是同一天就取这一天，如果不是同一天就取 -
    case ProductType.BNC:
      traded = trades.length === 1 ? trades[0] : '-';
      delivery = deliveries.at(-1) ?? '-';
      break;

    // 信用默认「明天+0」
    case ProductType.BCO:
      traded = formatDate(tomorrow?.tradedDate);
      delivery = formatDate(tomorrow?.deliveryDate);
      break;

    // 存单默认「+0」
    case ProductType.NCD:
      traded = formatDate(today?.tradedDate);
      delivery = formatDate(today?.deliveryDate);
      break;
    default:
      break;
  }

  return { traded, delivery };
};

/** 旧版清算速度转新版 */
export const transToLiquidationSpeedTag = (shortcutEnum: DateShortcutsEnum) => {
  if (shortcutEnum === DateShortcutsEnum.PLUS_0 || shortcutEnum === DateShortcutsEnum.PLUS_1) {
    return LiquidationSpeedTag.Today;
  }
  if (shortcutEnum === DateShortcutsEnum.TOMORROW || shortcutEnum === DateShortcutsEnum.TOMORROW_1) {
    return LiquidationSpeedTag.Tomorrow;
  }
  if (shortcutEnum === DateShortcutsEnum.MON) return LiquidationSpeedTag.Monday;
  if (shortcutEnum === DateShortcutsEnum.TUE) return LiquidationSpeedTag.Tuesday;
  if (shortcutEnum === DateShortcutsEnum.WED) return LiquidationSpeedTag.Wednesday;
  if (shortcutEnum === DateShortcutsEnum.THU) return LiquidationSpeedTag.Thursday;
  if (shortcutEnum === DateShortcutsEnum.FRI) return LiquidationSpeedTag.Friday;
  if (shortcutEnum === DateShortcutsEnum.SAT) return LiquidationSpeedTag.Saturday;
  if (shortcutEnum === DateShortcutsEnum.SUN) return LiquidationSpeedTag.Sunday;
  return LiquidationSpeedTag.Default;
};

/** 新版清算速度转旧版 */
export const transToShortcutEnum = (data: LiquidationSpeed) => {
  if (data.tag === LiquidationSpeedTag.Today && data.offset === 0) {
    return DateShortcutsEnum.PLUS_0;
  }
  if (data.tag === LiquidationSpeedTag.Today && data.offset === 1) {
    return DateShortcutsEnum.PLUS_1;
  }
  if (data.tag === LiquidationSpeedTag.Tomorrow && data.offset === 0) {
    return DateShortcutsEnum.TOMORROW;
  }
  if (data.tag === LiquidationSpeedTag.Tomorrow && data.offset === 1) {
    return DateShortcutsEnum.TOMORROW_1;
  }
  if (data.tag === LiquidationSpeedTag.Monday) return DateShortcutsEnum.MON;
  if (data.tag === LiquidationSpeedTag.Tuesday) return DateShortcutsEnum.TUE;
  if (data.tag === LiquidationSpeedTag.Wednesday) return DateShortcutsEnum.WED;
  if (data.tag === LiquidationSpeedTag.Thursday) return DateShortcutsEnum.THU;
  if (data.tag === LiquidationSpeedTag.Friday) return DateShortcutsEnum.FRI;
  if (data.tag === LiquidationSpeedTag.Saturday) return DateShortcutsEnum.SAT;
  if (data.tag === LiquidationSpeedTag.Sunday) return DateShortcutsEnum.SUN;
  return DateShortcutsEnum.NONE;
};

/** 将结算速度按照tag大小排序 */
export const orderLiquidationSpeed = (speeds: LiquidationSpeed[]) => {
  const date = speeds.filter(v => !!v.date);
  return [
    ...speeds
      .filter(v => !!v.tag)
      .sort((a, b) => (a.tag === b.tag ? a.offset - b.offset : (a.tag || 0) - (b.tag || 0))),
    ...(date || [])
  ];
};

/** 将结算方式数组格式化成可读的字符串 */
export const formatLiquidationSpeedListToString = (
  clearSpeedList: LiquidationSpeed[],
  format = 'YYYY-MM-DD',
  showDefault = false,
  defaultText = '默认'
) => {
  const speeds = orderLiquidationSpeed(clearSpeedList);
  if (!speeds.length) return '';

  // 如果当前的标签中存在默认（理论上默认是排他的，list的长度为1），立即返回
  if (speeds.some(clearSpeed => clearSpeed.tag === LiquidationSpeedTag.Default)) {
    return showDefault ? defaultText : '';
  }

  return speeds
    .filter(v => v.date || v.tag)
    .map(clearSpeed => liquidationSpeedToString(clearSpeed, format))
    .join(',');
};

/** 算法应用这边显示今天 */
const AlgoLiquidationSpeedTagMap = { ...LiquidationSpeedTagMap, [LiquidationSpeedTag.Today]: '今天' };

/** 将liqSpeed转换为字符串(针对算法应用) */
export const transformLiquidationSpeedList = (data: LiquidationSpeed[], format = 'MM.DD') => {
  return data.map(v => {
    if (v.date) return formatDate(v.date, format);
    if (v.tag === LiquidationSpeedTag.Default) return AlgoLiquidationSpeedTagMap[v.tag];
    if (v.tag) return AlgoLiquidationSpeedTagMap[v.tag] + (v.offset === 0 ? '+0' : '+1');
    return '';
  });
};

/** 获取当前的标签的优先级，结算方式优先级调整为今天>明天>周几>日期 */
const getLiqRank = (liquidationSpeed: LiquidationSpeed) => {
  if (liquidationSpeed.date) return 0;
  if (liquidationSpeed.tag) {
    if (WeekInSpeedTag.has(liquidationSpeed.tag)) return 1;
    if (liquidationSpeed.tag === LiquidationSpeedTag.Tomorrow) return 2;
  }
  return 3;
};

/** 将清算速度转换为旧版本的clear_speed */
export const turnClearSpeedToObject = (data: LiquidationSpeed[]) => {
  const result: ClearSpeedType = { labelSet: [], date: { label: '', offset: DateOffsetEnum.PLUS_0 } };
  if (data?.some(clearSpeed => clearSpeed.tag === LiquidationSpeedTag.Default)) {
    result.labelSet.push({ key: DateShortcutsEnum.NONE, offset: DateOffsetEnum.PLUS_0 });
    return result;
  }
  for (const v of data) {
    const offset = v.offset === 1 ? DateOffsetEnum.PLUS_1 : DateOffsetEnum.PLUS_0;
    if (v.date) result.date = { label: moment(Number(v.date)).format('YYYY-MM-DD'), offset };
    else if (v.date || v.tag) result.labelSet.push({ key: transToShortcutEnum(v), offset });
  }
  if (!result.labelSet.length && !result.date.label) {
    result.labelSet.push({ key: DateShortcutsEnum.NONE, offset: DateOffsetEnum.PLUS_0 });
  }
  return result;
};

/** 判断(通过label)结算方式是否是'周几'的形式 */
export const isWeekDayByLabel = (label: string) => {
  const labelKey = DateShortcuts.find(item => item.label === label)?.key;
  return labelKey?.includes('weekday');
};

/** 判断(通过key)结算方式是否是'周几'的形式 */
export const isWeekDayByKey = (key: DateShortcutsEnum) => key.includes('weekday');

export const transformToLiqSpeedList = (
  labelSet: SettlementMethod[],
  datePicker?: SettlementDate,
  dateOffset?: number
) => {
  const res: LiquidationSpeed[] = [];
  for (const item of labelSet) {
    let offset: number;
    if (item.key === DateShortcutsEnum.PLUS_0 || item.key === DateShortcutsEnum.TOMORROW) {
      offset = 0;
    } else if (item.key === DateShortcutsEnum.PLUS_1 || item.key === DateShortcutsEnum.TOMORROW_1) {
      offset = 1;
    } else {
      offset = dateOffset || 0;
    }
    res.push({ tag: transToLiquidationSpeedTag(item.key), offset });
  }
  if (datePicker?.label) {
    res.push({ date: datePicker.timestamp?.toString(), offset: dateOffset || 0 });
  }
  return res;
};

export const transformSettlementMethodToLiqSpeed = (settlementMethod: SettlementMethod) => {
  let offset: number;
  if (settlementMethod.key === DateShortcutsEnum.PLUS_0 || settlementMethod.key === DateShortcutsEnum.TOMORROW) {
    offset = 0;
  } else if (
    settlementMethod.key === DateShortcutsEnum.PLUS_1 ||
    settlementMethod.key === DateShortcutsEnum.TOMORROW_1
  ) {
    offset = 1;
  } else {
    offset = settlementMethod.offset;
  }
  return { tag: transToLiquidationSpeedTag(settlementMethod.key), offset };
};

/** 获取标签中最晚的交易日 */
export const getLatestLiquidationTradeTime = (data: LiqSpeedWithTradeDate[]) => {
  const tradeLabelList = data.map(item => item.tradedDate.valueOf());
  return max(tradeLabelList) || 0;
};

/** 判断清算速度和下市日的关系 */
export const justifyTradedDateLaterThanDeListing = (
  hasDefault: boolean,
  liqSpeedList: LiqSpeedWithTradeDate[],
  productType?: ProductType,
  delistedDate?: string,
  ctx = context.active()
) => {
  // 信用台子不进行校验
  if (!productType || productType === ProductType.BCO) return false;
  if (!liqSpeedList.length || !delistedDate || delistedDate === '0') return false;

  const fmtDeListedDate = moment(normalizeTimestamp(delistedDate));
  let latestTradeTime = getLatestLiquidationTradeTime(liqSpeedList);
  // 利率台子，如果结算方式中有'默认'，那么特殊处理，取 今天+1 这个标签对应的交易日(也就是今天)进行判断
  if (hasDefault) {
    const tradeTime = liqSpeedList
      .find(item => {
        return item.liquidationSpeed.tag === LiquidationSpeedTag.Today;
      })
      ?.tradedDate.valueOf();
    if (tradeTime) {
      latestTradeTime = tradeTime;
    } else {
      logger.e(
        {
          keyword: 'justify_traded_date_later_than_de_listing',
          msg: '默认值解析后不存在今天+1的结算方式，存在问题'
        },
        { immediate: true },
        ctx
      );
    }
  }
  return latestTradeTime >= fmtDeListedDate.valueOf();
};

/*
 * 针对作废区选中的报价进行判断
 * 如果已经下市，则不能返回基本报价区
 * 如果存在交易日早于今天，则结算方式设为默认，备注保留
 * 入参为报价
 */

/** 得到日历选择器对应的交易日和交割日 其实需要额外判断是否符合日期格式 */
export const getDatePickerDate = (date: string, offset: number, ctx = context.active()) => {
  const tradedDate = getNextTradedDate(date, true);

  let deliveryDate = formatDate(Date.now());
  if (offset === 0) deliveryDate = tradedDate;
  else deliveryDate = getNextTradedDate(tradedDate);

  logger.ctxInfo(
    ctx,
    `[getDatePickerDate] get tradedDate=${tradedDate.toLocaleString()}, deliveryDate=${deliveryDate.toLocaleString()}`
  );

  return { tradedDate: moment(tradedDate), deliveryDate: moment(deliveryDate) };
};

/** 比较两个时间是否一致 */
export const compareSameTime = (p1: LiqSpeedWithMoment, p2: LiqSpeedWithMoment) => {
  return (
    formatDate(p1.tradedDate) === formatDate(p2.tradedDate) &&
    formatDate(p1.deliveryDate) === formatDate(p2.deliveryDate)
  );
};

/** 判断当前的标签是否应该被过滤掉 */
const isLiqSpeedWithMomentsShouldFiltered = (
  liqSpeedMoment: LiqSpeedWithMoment,
  myIndex: number,
  list: LiqSpeedWithMoment[]
) => {
  let isFiltered = false;
  const myRank = getLiqRank(liqSpeedMoment.liquidationSpeed);
  for (const [index, item] of list.entries()) {
    if (compareSameTime(liqSpeedMoment, item)) {
      const itemRank = getLiqRank(item.liquidationSpeed);
      if (myRank < itemRank) isFiltered = true;
      if (myRank === itemRank) {
        if (myIndex < index) {
          isFiltered = true;
        }
      }
    }
  }
  return isFiltered;
};

export const getWeekdaysBySpeedTag = (tag: LiquidationSpeedTag) => {
  switch (tag) {
    case LiquidationSpeedTag.Monday:
      return 1;
    case LiquidationSpeedTag.Tuesday:
      return 2;
    case LiquidationSpeedTag.Wednesday:
      return 3;
    case LiquidationSpeedTag.Thursday:
      return 4;
    case LiquidationSpeedTag.Friday:
      return 5;
    case LiquidationSpeedTag.Saturday:
      return 6;
    case LiquidationSpeedTag.Sunday:
      return 7;
    default:
      return 0;
  }
};

/** 计算标签对应的交易日 有一个特殊情况是今天是周末，需要用fetchTodayOrNextWorkday来拿交易日 */
export const calTradedDay = async (tag: LiquidationSpeedTag, listedDate?: string, ctx = context.active()) => {
  let curr = moment();
  const listedTime = listedDate ? moment(normalizeTimestamp(listedDate)).startOf('day') : void 0;
  // 是否为未上市债券
  const isUnlisted = listedDate && listedTime ? listedTime.isAfter(curr) : false;
  // 获取上市日后第一个交易日
  if (isUnlisted && listedTime) {
    curr = listedTime;
  }
  let tradedDate: string;
  let weekday: number;
  switch (tag) {
    case LiquidationSpeedTag.Today:
      tradedDate = withCtx(ctx, getNextTradedDate, curr, true);
      break;
    case LiquidationSpeedTag.Tomorrow:
      // 未上市债券的明天+0/明天+1与+0/+1相同
      if (isUnlisted) {
        tradedDate = withCtx(ctx, getNextTradedDate, curr, true);
      } else {
        const currNextDay = curr.clone().add(1, 'days');
        tradedDate = withCtx(ctx, getNextTradedDate, currNextDay, true);
      }
      break;
    /**  默认标签会走到此逻辑中，但获取到的交易日不是真实值，由于获取该日期作用在于判断冲突，
     而默认标签不会和任何其他标签同时出现，因此此处简单处理。 */
    default:
      weekday = getWeekdaysBySpeedTag(tag);
      // 对未上市债券，如果上市日正好是下周几，则交易日为上市日
      if (isUnlisted && getNextWeekday(moment(), weekday).isSame(curr, 'day')) {
        tradedDate = withCtx(ctx, getNextTradedDate, formatDate(curr));
      } else {
        tradedDate = withCtx(ctx, getNextTradedDate, getNextWeekday(curr, weekday), true);
      }
      break;
  }
  logger.ctxInfo(ctx, `[calTradedDay] cal traded day, tag=${tag}, tradedDate=${tradedDate.toLocaleString()}`);
  return moment(tradedDate);
};

/** 计算标签对应的交易日和交割日 */
export const calcTradeAndDeliDays = async (
  tag: LiquidationSpeedTag,
  offset: number,
  listedDate?: string,
  ctx = context.active()
) => {
  const tradedDate = await calTradedDay(tag, listedDate);
  let deliveryDate: Moment;
  if (!offset) deliveryDate = tradedDate;
  else deliveryDate = moment(getNextTradedDate(formatDate(tradedDate)));
  logger.ctxInfo(
    ctx,
    `[calcTradeAndDeliDays] get tradedDate=${tradedDate.toLocaleString()}, deliveryDate=${deliveryDate.toLocaleString()}`
  );
  return { tradedDate, deliveryDate };
};

/** 把服务端下发的备注标签列表都提前算好交易日与交割日，放到同一个结构中备用 */
export const liqSpeedListAddMoments = async (
  liqSpeedList: LiquidationSpeed[],
  listedDate?: string,
  ctx = context.active()
) => {
  const liqSpeedWithMoments: LiqSpeedWithMoment[] = [];
  // 先找到表示date的结构，如果有只能有一个
  const dateLiqSpeed = liqSpeedList.find(item => item.date);

  if (dateLiqSpeed?.date) {
    liqSpeedWithMoments.push({
      liquidationSpeed: dateLiqSpeed,
      ...getDatePickerDate(dateLiqSpeed.date, dateLiqSpeed.offset, ctx)
    });
  }

  // 找到带有tag的结构列表
  const tagLiqList = liqSpeedList.filter(item => item.tag);
  const tradAndDeliDays = await Promise.all(
    tagLiqList.map(item => calcTradeAndDeliDays(item.tag || LiquidationSpeedTag.Today, item.offset, listedDate, ctx))
  );

  for (const [index, value] of tagLiqList.entries()) {
    liqSpeedWithMoments.push({
      liquidationSpeed: value,
      tradedDate: tradAndDeliDays[index].tradedDate,
      deliveryDate: tradAndDeliDays[index].deliveryDate
    });
  }
  return liqSpeedWithMoments;
};

// 获取距离当前最近的结算方式（先比交易日，相同则再比交割日）
export const getNearestLiquidationSpeed = async (liqSpeedList?: LiquidationSpeed[]) => {
  if (!liqSpeedList?.length) return undefined;
  const liqWithMoments = await liqSpeedListAddMoments(liqSpeedList);
  const sortedList = liqWithMoments.sort((a, b) => {
    const tradeDateDiff = (a.tradedDate?.valueOf() || 0) - (b.tradedDate?.valueOf() || 0);
    const deliveryDateDiff = (a.deliveryDate?.valueOf() || 0) - (b.deliveryDate?.valueOf() || 0);
    if (tradeDateDiff === 0) {
      return deliveryDateDiff;
    }
    return tradeDateDiff;
  });
  return sortedList.at(0);
};

/** 过滤掉交易日和交割日相同但优先级更低的标签 */
export const filterLiquidationSpeedList = (liqSpeedList: LiqSpeedWithMoment[]) => {
  return liqSpeedList.filter((v, index) => !isLiqSpeedWithMomentsShouldFiltered(v, index, liqSpeedList));
};

/** 检查交易日下市日的关系 */
export const checkListing = async (
  hasDefault: boolean,
  data?: QuoteCalcType,
  bond?: FiccBondBasic,
  productType?: ProductType,
  ctx = context.active()
) => {
  if (data) {
    const liqSpeedList: LiquidationSpeed[] = data.liquidation_speed_list || [];
    const lipSpeedMoments = await liqSpeedListAddMoments(liqSpeedList, bond?.listed_date, ctx);
    return justifyTradedDateLaterThanDeListing(hasDefault, lipSpeedMoments, productType, bond?.delisted_date, ctx);
  }
  return false;
};

export const getDefaultLiqSpeedList = (productType?: ProductType) => {
  switch (productType) {
    case ProductType.BCO:
      return [{ tag: LiquidationSpeedTag.Tomorrow, offset: 0 }];
    case ProductType.BNC:
      return [
        { tag: LiquidationSpeedTag.Tomorrow, offset: 0 },
        { tag: LiquidationSpeedTag.Today, offset: 1 }
      ];
    case ProductType.NCD:
      return [{ tag: LiquidationSpeedTag.Today, offset: 0 }];
    default:
      return [];
  }
};

/** 将默认的结算方式按照productType转换成对应的标签 */
export const getDefaultTagsByProduct = (liqSpeeds: LiquidationSpeed[], productType?: ProductType) => {
  if (!liqSpeeds.some(v => v.tag === LiquidationSpeedTag.Default)) return { liqSpeeds, hasDefault: false };
  return { liqSpeeds: getDefaultLiqSpeedList(productType), hasDefault: true };
};

/** 生成合法的结算方式列表 */
export const generateLegalLiqSpeed = async (
  lists?: LiquidationSpeed[],
  productType?: ProductType,
  bond?: FiccBondBasic,
  operationType?: OperationType,
  ctx = context.active()
) => {
  logger.ctxInfo(
    ctx,
    `[generateLegalLiqSpeed] lists=${JSON.stringify(lists)},` +
      ` bond=${JSON.stringify(bond)}, operationType=${operationType}`
  );
  if (lists?.length && operationType != OperationType.BondQuoteUnRefer) return lists;

  const defaultTags = [{ tag: LiquidationSpeedTag.Default, offset: 0 }];
  const { liqSpeeds, hasDefault } = getDefaultTagsByProduct(defaultTags, productType);

  if (operationType === OperationType.BondQuoteUnRefer) {
    const dateLiqSpeed = lists?.find(v => !!v.date);
    if (dateLiqSpeed) {
      const tradeDay = moment(getNextTradedDate(moment(Number(dateLiqSpeed.date)), true));
      logger.ctxInfo(
        ctx,
        `[generateLegalLiqSpeed] input date=${moment(Number(dateLiqSpeed.date)).toLocaleString()}, ` +
          `get tradeDay=${tradeDay.toLocaleString()}`
      );
      // 如果结算方式过期了，将过期的排除，如果排除后没有合法的，改为默认
      if (tradeDay.isBefore(moment(), 'date')) {
        if (lists?.length === 1) return [{ tag: LiquidationSpeedTag.Default, offset: 0 }];
        return lists?.filter(item => !!item?.tag);
      }
    }
    if (lists?.length) return lists;
  }
  const listingWarn = await checkListing(hasDefault, { liquidation_speed_list: liqSpeeds }, bond, productType, ctx);
  return listingWarn ? [{ tag: LiquidationSpeedTag.Today, offset: 0 }] : defaultTags;
};

/** 是否存在早于当前日期的结算日期 */
export const isLiqSpeedListDelays = (liqSpeedList: LiquidationSpeed[]) => {
  const dateSpeed = liqSpeedList.find(item => item.date);
  if (dateSpeed?.date) {
    if (Number(dateSpeed.date) < moment().startOf('day').valueOf()) {
      return true;
    }
  }
  return false;
};

/** 是否是周几的形式 */
export const isWeekCategory = (shortCutEnum: DateShortcutsEnum) => Weeks.has(shortCutEnum);

export const isWeekCategoryOnService = (liquidationSpeedTag?: LiquidationSpeedTag) => {
  if (!liquidationSpeedTag) return false;
  return WeeksOnService.has(liquidationSpeedTag);
};

/** 根据选中的非week类型的标签，获取对应的offset */
export const getNotWeekOffset = (shortcutEnum: DateShortcutsEnum, defaultOffset: DateOffsetEnum) => {
  if (shortcutEnum === DateShortcutsEnum.PLUS_0 || shortcutEnum === DateShortcutsEnum.TOMORROW) {
    return DateOffsetEnum.PLUS_0;
  }
  if (shortcutEnum === DateShortcutsEnum.PLUS_1 || shortcutEnum === DateShortcutsEnum.TOMORROW_1) {
    return DateOffsetEnum.PLUS_1;
  }
  return defaultOffset;
};

/** 把服务端下发的备注标签列表都提前算好交易日 */
export const liqSpeedListAddTradeDay = async (liqSpeedList: LiquidationSpeed[]) => {
  const liqSpeedWithTradeDate: LiqSpeedWithTradeDate[] = [];
  // 先找到表示date的结构，如果有只能有一个
  const dateLiqSpeed = liqSpeedList.find(item => item.date);

  if (dateLiqSpeed?.date) {
    const tradedDate = moment(getNextTradedDate(moment(normalizeTimestamp(dateLiqSpeed.date)), true));
    liqSpeedWithTradeDate.push({
      liquidationSpeed: dateLiqSpeed,
      tradedDate
    });
  }

  // 找到带有tag的结构列表
  const tagLiqList = liqSpeedList.filter(item => item.tag);
  const tradeDays = await Promise.all(tagLiqList.map(item => calTradedDay(item.tag || LiquidationSpeedTag.Today)));

  for (const [index, value] of tagLiqList.entries()) {
    liqSpeedWithTradeDate.push({
      liquidationSpeed: value,
      tradedDate: tradeDays[index]
    });
  }
  return liqSpeedWithTradeDate;
};

/** 批量获取交易日交割日 */
export const batchGetTreadDayAndDeliDay = async (data: BatchGetTreadDayAndDeliDayProps, listedDate?: string) => {
  const days = await Promise.all(data.map(item => calcTradeAndDeliDays(item.tag, item.offset, listedDate)));
  const response: BatchGetTreadDayAndDeliDayResponse[] = days.map((v, i) => ({
    key: transToShortcutEnum({ tag: data[i].tag, offset: data[i].offset }),
    offset: data[i].offset,
    deliveryDate: v.deliveryDate,
    tradedDate: v.tradedDate
  }));
  return response;
};

/** 得到多个标签对应的交易日和交割日的集合 */
export const getAllLabelTradedAndDeliveryDate = async (params: LiquidationSpeed[]) => {
  return Promise.all(params.map(param => calcTradeAndDeliDays(param.tag || LiquidationSpeedTag.Today, param.offset)));
};

/** 在一个字符串数组中找到日期的位置(返回第一个日期格式的值) */
export const findIndexOfDate = (param: string[]) => {
  for (const [i, element] of param.entries()) {
    if (element.includes('-')) return i;
  }
  return -1;
};

/** 获取 +1 标签的offset */
export const getOffsetOfPlus = (key: DateShortcutsEnum, defaultOffset = DateOffsetEnum.PLUS_0) => {
  if (key === DateShortcutsEnum.PLUS_1 || key === DateShortcutsEnum.TOMORROW_1) return DateOffsetEnum.PLUS_1;
  if (key === DateShortcutsEnum.PLUS_0 || key === DateShortcutsEnum.TOMORROW) return DateOffsetEnum.PLUS_0;
  return defaultOffset;
};
