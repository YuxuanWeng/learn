import { KeyboardEvent } from 'react';
import { SERVER_NIL } from '@fepkg/common/constants';
import { KeyboardKeys, fixFloatDecimal, number2LimitedString } from '@fepkg/common/utils';
import { message } from '@fepkg/components/Message';
import type { BondQuoteMulUpdate } from '@fepkg/services/types/bond-quote/mul-update';
import {
  LiquidationSpeed,
  QuickFilter,
  QuoteLite,
  RangeDouble,
  TableRelatedFilter
} from '@fepkg/services/types/common';
import { FRType, LiquidationSpeedTag, OperationType, ProductType, RepaymentMethod } from '@fepkg/services/types/enum';
import { cloneDeep, includes, isEqual, isUndefined } from 'lodash-es';
import moment, { Moment } from 'moment';
import { QuoteFilterGroupItem } from '@/common/services/hooks/useFilterGroupQuery';
import { Settlement } from '@/common/services/hooks/useSettings/useProductSettlementSettings';
import {
  filterLiquidationSpeedList,
  formatLiquidationSpeedListToString,
  getDefaultTagsByProduct,
  isLiqSpeedListDelays,
  justifyTradedDateLaterThanDeListing,
  liqSpeedListAddMoments
} from '@/common/utils/liq-speed';
import { getCommentFlagLabel } from '@/components/Quote/utils';
import { RangeInputValue } from '@/components/RangeInput';
import { CommentInputFlagValue } from '@/components/business/CommentInput';
import {
  DEEP_QUOTE_MODAL_ID,
  DEEP_QUOTE_MODAL_MAX_HEIGHT,
  DEEP_QUOTE_MODAL_WIDTH
} from '@/pages/ProductPanel/components/OptimalTable/constants';
import { OptimalTableColumn } from '@/pages/ProductPanel/components/OptimalTable/types';

export const defaultGroupFilterConfig = {
  /** 按钮展示区域最大宽度 */
  max_group_width: 1300,
  /** 字体宽度 */
  font_size: 12,
  /** 按钮最小宽带 */
  min_radio_width: 36,
  /** 按钮最大宽度 */
  max_radio_width: 124
};

/**
 * 由 UI 中 checked 值转换为接口需要的数据结构
 */
export const transformCheckboxValue = (val?: boolean[]) => {
  return val?.length === 2 ? undefined : val?.[0];
};

/**
 * 删除对象中的 falsy 值
 */
export const deleteFalsyValue = <T extends object>(obj: T, extractKeys?: (keyof T)[]) => {
  const objClone = cloneDeep(obj);

  for (const key of Object.keys(objClone)) {
    if (Object.hasOwn(objClone, key)) {
      if (!objClone[key] && !extractKeys?.includes(key as keyof T)) {
        delete objClone[key];
      }
    }
  }

  return objClone;
};

export const clearRangeDouble = (rangeDouble?: RangeDouble) => {
  if (!rangeDouble) return rangeDouble;
  const { min, max } = rangeDouble;
  if (min && max && Number(min) > Number(max)) return undefined;
  return { min: min ? Number(min) : undefined, max: max ? Number(max) : undefined };
};

export const deleteInvalidQuickFilterValues = (quickFilter: QuickFilter) => {
  const quickFilterClone = cloneDeep(quickFilter);
  quickFilterClone.val_modified_duration = clearRangeDouble(quickFilter.val_modified_duration);
  quickFilterClone.coupon_rate = clearRangeDouble(quickFilter.coupon_rate);
  quickFilterClone.offset = clearRangeDouble(quickFilter.offset);
  quickFilterClone.yield = clearRangeDouble(quickFilter.yield);
  return quickFilterClone;
};

export const transformRemainDays = (type: 'date' | 'string', remain_days_range?: RangeInputValue) => {
  if (!remain_days_range?.length) return type === 'date' ? [null, null] : ['', ''];
  const [rangeDate1, rangeDate2] = remain_days_range;

  if (type === 'date') {
    let date1: Moment | null = null;
    let date2: Moment | null = null;
    if (rangeDate1 && typeof rangeDate1 === 'string') date1 = moment(rangeDate1);
    if (rangeDate2 && typeof rangeDate2 === 'string') date2 = moment(rangeDate2);
    return [date1, date2];
  }
  return remain_days_range;
};

/** 获取剩余日期范围框的默认值 */
export const resetRemainDaysRange = (type: 'date' | 'string') => {
  if (type === 'date') return [null, null];
  return ['', ''];
};

/** 补全数组 */
export const completionArray = <T>(len: number, quotes: T[], suffix: T) => {
  const newArr = cloneDeep(quotes); // 使用了lodash的深拷贝,可替代
  if (newArr.length < len) {
    // 判断长度是否足够，不够则补全
    for (let i = 0; i < len - quotes.length; i += 1) {
      newArr.push(suffix);
    }
    return newArr;
  }
  return quotes;
};

/** 补全两个数组 */
export const completion2Array = <T>(first: T[], second: T[], suffix: T) => {
  let resFirst = first;
  let resSecond = second;
  if (first.length > second.length) resSecond = completionArray(first.length, second, suffix);
  if (first.length < second.length) resFirst = completionArray(second.length, first, suffix);
  return [resFirst, resSecond];
};

/** 将liquidationSpeed按照tag大小排序 */
export const orderLiquidationSpeed = (speeds: LiquidationSpeed[]) => {
  const date = speeds.find(v => !!v.date);
  return speeds
    .filter(v => !!v.tag)
    .sort((a, b) => {
      if (a.tag === b.tag) return a.offset - b.offset;
      return (a.tag || 0) - (b.tag || 0);
    })
    .concat(date || []);
};

// 市场成交的结算方式字段获取方法
export const getLiqSpeedStrForDealTable = (liqSpeedList?: LiquidationSpeed[]) => {
  if (!liqSpeedList?.length) return '';
  if (liqSpeedList.length > 1) {
    return '+1';
  }
  const liquidationSpeed = liqSpeedList[0];
  // 若为在bds-idb手工录入或在面板中修改后保存，则会展示T+N的格式
  return `T+${liquidationSpeed.offset}`;
};

/**
 * 转换价格相关的内容
 * @param price 价格相关的字段
 * @keepFourDecimalPlaces 是否在超过小数点后 4 位时，保留 4 位小数
 */
export const transform2PriceContent = (price?: number, keepFourDecimalPlaces?: boolean) => {
  // 没有价格或价格小于 0，展示 --
  if (!price || price < 0) return '--';
  return keepFourDecimalPlaces ? fixFloatDecimal(price, 4).toString() : price.toString();
};

/** 转换利差的内容 */
export const transform2SpreadContent = (spread?: number, frType?: FRType, yieldVal?: number) => {
  // 如果为固息，展示 --
  if (!frType || frType === FRType.FRD) return '--';
  // 没有收益率，展示 --
  if (!yieldVal || yieldVal === SERVER_NIL) return '--';
  // 如果利差为 -1，展示 --
  if (spread === SERVER_NIL) return '--';

  return !isUndefined(spread) ? fixFloatDecimal(spread, 4).toString() : '';
};

/** 转换提前还本的内容 */
export const transform2RepaymentMethod = (repayment_method?: RepaymentMethod) => {
  return repayment_method === RepaymentMethod.RepayInAdvance ? '是' : '';
};

/** 转换久期的内容 */
export const transform2ValModifiedDuration = (valModifiedDuration?: number) => {
  if (isUndefined(valModifiedDuration)) return '';
  if (valModifiedDuration < 0) return '--';

  return valModifiedDuration.toFixed(4);
};

/** 转换质押率的内容 */
export const transform2ConversionRate = (conversionRate?: number) => {
  if (isUndefined(conversionRate)) return '--';
  if (conversionRate < 0) return '--';

  return conversionRate.toFixed(4);
};

/** 转换 PVBP 的内容 */
export const transform2PVBP = (valBasisPointValue?: number) => {
  if (isUndefined(valBasisPointValue)) return '--';
  if (valBasisPointValue <= 0) return '--';

  return number2LimitedString(valBasisPointValue, -1, 4, { tailZero: false }).toString();
};

/** 转换为周六/日的内容 */
export const transform2WeekendDay = (maturity_date?: string) => {
  if (!maturity_date) return '';
  return ['日', '', '', '', '', '', '六'][moment(Number(maturity_date)).day()];
};

/** 获取 TableRelatedFilter Tags 的值 */
export const getTableRelatedFilterTagsValue = (filterValue: TableRelatedFilter) => {
  const res: string[] = [];
  if (filterValue.is_lead) res.push('is_lead');
  if (filterValue.is_vip) res.push('is_vip');
  return res;
};

export const getCpSpanColor = (isInternal: boolean, isVip: boolean, isOther?: boolean) => {
  const index = parseInt(`${Number(isInternal)}${Number(isVip)}`, 2);
  const color =
    isOther && !index ? 'text-gray-300' : ['', 'text-yellow-100', 'text-primary-100', 'text-primary-100'][index];
  return color;
};

/** 获取settlement对应的悬停显示 */
export const getSettlementLabel = (liqSpeedList: LiquidationSpeed[], comment: string, haveMethod: boolean) => {
  if (!haveMethod) return '';
  let res = formatLiquidationSpeedListToString(liqSpeedList);
  if (!res.length && comment) res = comment;
  else if (res.length && comment) res = `${res};${comment}`;
  return res;
};

const getDeepQuoteHeight = (original?: OptimalTableColumn) => {
  if (!original) return DEEP_QUOTE_MODAL_MAX_HEIGHT;
  const { bidInfo } = original;
  const bidQuotes = (bidInfo.optimalQuoteList?.length || 0) + (bidInfo.otherQuoteList?.length || 0);
  // 条数 * 单元格高 + 内外边距 + 1像素冗余
  return bidQuotes * 30 + 62 + 1;
};

export const getDeepQuoteModalPosition = (
  ev: HTMLDivElement,
  original?: OptimalTableColumn
): { left: number; top: number; bottom: number; right: number } => {
  const oDeepQuote = document.getElementById(DEEP_QUOTE_MODAL_ID);

  // 单元格的宽高和坐标
  const { x: cellX, y: cellY, width: cellWidth, height: cellHeight } = ev.getBoundingClientRect();

  // 深度悬浮框的宽高
  const oDeepQuoteWidth = oDeepQuote ? parseInt(getComputedStyle(oDeepQuote).width, 10) : DEEP_QUOTE_MODAL_WIDTH;

  // 通过最优报价条数，手动计算深度悬浮窗的高度
  const oDeepQuoteHeight = getDeepQuoteHeight(original);

  // 客户端的宽高
  const clientWidth = window.innerWidth;
  const clientHeight = window.innerHeight;

  let left = 0;
  let right = -1;

  if (clientWidth - cellX - cellWidth / 2 < oDeepQuoteWidth) {
    right = 3;
  } else {
    left = cellX + cellWidth / 2 - 3;
  }

  let top = -1;
  let bottom = -1;

  if (clientHeight - cellY - cellHeight < oDeepQuoteHeight && cellY >= oDeepQuoteHeight) {
    // 上面够，下面不够，放上面
    bottom = clientHeight - cellY;
  } else {
    // 上下都不够 || 上面不够，下面够，放下面
    top = cellY + cellHeight;
  }

  return { left, right, top, bottom };
};

export const getCommentLabel = (settlement: Settlement) => {
  const liq_speed = formatLiquidationSpeedListToString(settlement.liq_speed_list || [], undefined, true);
  const flagLabel = getCommentFlagLabel(settlement.flagValue);
  const point = liq_speed && (settlement.comment || flagLabel) ? ';' : '';
  return liq_speed + point + flagLabel + (settlement.comment ? ` ${settlement.comment}` : settlement.comment);
};

export const getUpdateCommentFlags = (original: CommentInputFlagValue, updates: CommentInputFlagValue) => {
  const updateFlags: CommentInputFlagValue = cloneDeep(updates);
  for (const i in original) {
    if (!!updates[i] && updates[i] === original[i]) updateFlags[i] = false;
    else if (!updates[i]) updateFlags[i] = original[i];
  }
  return { ...original, ...updateFlags };
};

/** 判断结算方式是否相等 */
export const isArrayValueEqual = (a: LiquidationSpeed[], b: LiquidationSpeed[]) => {
  const ca: LiquidationSpeed[] = [];
  const cb: LiquidationSpeed[] = [];
  for (const v of a) {
    const target = { tag: v.tag, offset: v.offset, date: v.date };
    if (target.tag == null) delete target.tag;
    if (target.date == null) delete target.date;
    ca.push(JSON.parse(JSON.stringify(target)));
  }
  for (const v of b) {
    const target = { tag: v.tag, offset: v.offset, date: v.date };
    if (target.tag == null) delete target.tag;
    if (target.date == null) delete target.date;
    cb.push(JSON.parse(JSON.stringify(target)));
  }
  return isEqual(ca, cb);
};

/** 计算分组按钮分页点 */
export const getPagination = (
  filterGroup?: QuoteFilterGroupItem[],
  config?: {
    max_group_width?: number;
    font_size?: number;
    min_radio_width?: number;
    max_radio_width?: number;
  }
) => {
  let pagination = 0;
  let width = 0;
  for (const group of filterGroup ?? []) {
    width += Math.min(
      group.group_name.length * (config?.font_size ?? defaultGroupFilterConfig.font_size) +
        (config?.min_radio_width ?? defaultGroupFilterConfig.min_radio_width),
      config?.max_radio_width ?? defaultGroupFilterConfig.max_radio_width
    );
    if (width < (config?.max_group_width ?? defaultGroupFilterConfig.max_group_width)) {
      pagination++;
    } else {
      break;
    }
  }
  return pagination;
};

export const preventEnterDefault = (e: KeyboardEvent<HTMLElement>) => {
  if (e.key === KeyboardKeys.Enter) e.preventDefault();
};

// 根据作废区报价的结算方式来判断报价是否能回到基本报价区以及需要修改的信息
export const getUnreferParamsByQuoteLite = async (quotes: QuoteLite[], productType?: ProductType) => {
  const resultQuotes = cloneDeep(quotes);
  const failRowsId: string[] = []; // 晚于或等于下市日的作废区的quote_id
  const failRowsOrder: number[] = []; // 晚于或等于下市日的作废区的index+1,用于展示错误信息

  // 先把批量refer的报价都补算出交易日和交割日并添加default标签
  const listWithMomentsWithDefault = await Promise.all(
    resultQuotes.map(async item => {
      const { liqSpeeds, hasDefault } = getDefaultTagsByProduct(item.liquidation_speed_list || [], productType);
      return {
        liqSpeedWithMoments: await liqSpeedListAddMoments(liqSpeeds, item.bond_basic_info?.listed_date),
        hasDefault
      };
    })
  );

  for (const [index, liqSpeedWithMoments] of listWithMomentsWithDefault.entries()) {
    // 把相同但低优的标签过滤掉
    const quote = resultQuotes[index];
    const filteredList = filterLiquidationSpeedList(liqSpeedWithMoments.liqSpeedWithMoments);
    if (!liqSpeedWithMoments.hasDefault) {
      quote.liquidation_speed_list = filteredList.map(item => item.liquidationSpeed);
    }
    const clearSpeedLater = justifyTradedDateLaterThanDeListing(
      liqSpeedWithMoments.hasDefault,
      filteredList,
      productType,
      quote.bond_basic_info?.delisted_date
    );
    if (clearSpeedLater) {
      failRowsId.push(quote.quote_id);
      failRowsOrder.push(index + 1);
    }
  }
  // 交易日晚于下市日的提示
  if (resultQuotes.length === 1 && failRowsId.length === 1) {
    message.warning('交易日不可晚于或等于下市日');
  } else {
    let waringMessage = '';
    if (failRowsId.length) {
      waringMessage = failRowsOrder.join(',');
      message.warning(`第${waringMessage}行交易日不可晚于或等于下市日！`);
    }
  }
  // 交易日都早于下市日的报价列表
  const availableReferQuotes = resultQuotes.filter(item => {
    return !includes(failRowsId, item.quote_id);
  });
  // 判断准备unrefer的列表中是否有报价结算日早于当前日期
  for (const quote of availableReferQuotes) {
    // 如果找到比当前日期早的结算日期，说明这个结算方式过期了
    const listDelays = isLiqSpeedListDelays(quote.liquidation_speed_list || []);
    // 如果结算方式过期了，将过期的排除，如果排除后没有合法的，改为默认
    if (listDelays) {
      if (quote.liquidation_speed_list?.length === 1) {
        quote.liquidation_speed_list = [
          {
            tag: LiquidationSpeedTag.Default,
            offset: 0
          }
        ];
      } else {
        quote.liquidation_speed_list = quote.liquidation_speed_list?.filter(item => {
          return !!item?.tag;
        });
      }
    }
  }
  const operation_info = { operation_type: OperationType.BondQuoteUnRefer };
  const params: BondQuoteMulUpdate.Request = {
    quote_item_list: availableReferQuotes?.map(v => ({
      quote_id: v.quote_id,
      liquidation_speed_list: v.liquidation_speed_list,
      comment: v.comment,
      refer_type: 0
    })),
    operation_info
  };
  return params;
};
