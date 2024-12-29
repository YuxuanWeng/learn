import { RangePickerProps } from 'antd/lib/date-picker';
import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import { message } from '@fepkg/components/Message';
import { LiquidationSpeed } from '@fepkg/services/types/common';
import { ProductType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import moment, { Moment } from 'moment';
import { DateOffsetEnum, DateOffsetValue } from '../../types/date';
import { dealDateManager } from '../../utils/data-manager/deal-date-manager';
import { DealDateChangeParams, DealDateMutationState, UseDealDateMutationParams } from './types';

/**
 * 获取当前交易日的的下一个交易日
 * @param tradedDate 交易日, 不传则默认今天
 * @param withToday 是否包括今天
 * @param tradeDateMomentRange 交易日范围
 */
export const getNextTradedDate = (
  tradedDate?: string | number | Moment,
  withToday?: boolean,
  tradeDateMomentRange = dealDateManager.getDealDateMomentRange()
) => {
  tradedDate = formatDate(tradedDate ?? Date.now());
  const first = tradeDateMomentRange.find(date => {
    if (withToday) {
      return date.isSameOrAfter(tradedDate, 'day');
    }
    return date.isAfter(tradedDate, 'day');
  });

  return formatDate(first ?? moment(tradedDate).add(1, 'day'));
};

/**
 * 根据产品类型与默认的交易日获取默认的交割日
 * @param productType 产品类型
 * @param defaultTradedDate 默认的交易日
 * @param tradeDateRange 交易日范围
 */
export const getDefaultDeliveryDate = (
  defaultTradedDate: string,
  productType?: ProductType,
  tradeDateRange = dealDateManager.getDealDateMomentRange()
) => {
  switch (productType) {
    // 信用债与NCD默认交易日等于交割日
    case ProductType.BCO:
    case ProductType.NCD:
      return defaultTradedDate;
    // 利率债默认为+1
    default:
      return getNextTradedDate(defaultTradedDate, false, tradeDateRange);
  }
};

/** 判断获取下一个交易日需不需要包括今天 */
export const withToday = (productType?: ProductType) => {
  switch (productType) {
    case ProductType.BCO:
      // 信用债默认不包括今天
      return false;
    case ProductType.NCD:
    case ProductType.BNC:
      // 利率、NCD债默认包括今天
      return true;
    default:
      return true;
  }
};

export const isDisabledDealDate = (
  date: string,
  tradeDateRangeMoment = dealDateManager.getDealDateMomentRange(),
  startDate?: string,
  endDate?: string
) => {
  let [start] = tradeDateRangeMoment;
  start = startDate ? moment(formatDate(startDate)) : start;
  let [end] = tradeDateRangeMoment.slice(-1);
  end = endDate ? moment(formatDate(endDate)) : end;

  const dateMoment = moment(date).startOf('day');
  /** 非工作日的日期需要禁用掉 */
  return !tradeDateRangeMoment.some(d => d.isSame(dateMoment, 'day')) || dateMoment < start || dateMoment >= end;
};

export const useDisabledDealDate = (
  tradeDateRangeMoment: Moment[],
  startDate?: string,
  endDate?: string
): RangePickerProps['disabledDate'] =>
  useMemoizedFn(current => isDisabledDealDate(current, tradeDateRangeMoment, startDate, endDate));

export const initDealDateState = (params: UseDealDateMutationParams) => {
  const { productType, rangeMoment = dealDateManager.getDealDateMomentRange(), defaultValue } = params;

  const tradedDate = formatDate(
    defaultValue?.tradedDate ?? getNextTradedDate(defaultValue?.today, withToday(productType), rangeMoment)
  );
  const deliveryDate = formatDate(
    defaultValue?.deliveryDate ?? getDefaultDeliveryDate(tradedDate, productType, rangeMoment)
  );

  const nextTradedDate = getNextTradedDate(tradedDate, false, rangeMoment);
  const todayNextTradedDate = getNextTradedDate(defaultValue?.today, false, rangeMoment);

  let tradedDateOffset: DateOffsetValue | undefined;
  let deliveryDateOffset: DateOffsetValue | undefined;

  if (!defaultValue?.tradedDate) {
    // 如果交易日没有初始值
    switch (productType) {
      case ProductType.BCO:
        // 信用债默认选中偏移选项中的明天
        tradedDateOffset = DateOffsetEnum.PLUS_1;
        break;
      default:
        // 利率债，NCD 默认选中偏移项的今天
        tradedDateOffset = DateOffsetEnum.PLUS_0;
        break;
    }
  } else if (tradedDate === defaultValue?.today) {
    // 如果交易日为今天，则选中偏移选项中的今天
    tradedDateOffset = DateOffsetEnum.PLUS_0;
  } else if (tradedDate === todayNextTradedDate) {
    // 如果为今天的下一个交易日，则选中偏移选项中的明天
    tradedDateOffset = DateOffsetEnum.PLUS_1;
  }

  if (deliveryDate === tradedDate) {
    // 如果交割日与交易日相同，则选中偏移选项中的 T+0
    deliveryDateOffset = DateOffsetEnum.PLUS_0;
  } else if (deliveryDate === nextTradedDate) {
    // 如果为交易日的下一天，则选中偏移选项中的 T+1
    deliveryDateOffset = DateOffsetEnum.PLUS_1;
  }

  return { tradedDate, tradedDateOffset, deliveryDate, deliveryDateOffset };
};

export const changeTradedDate = ({ unlisted, today, rangeMoment, state, date }: DealDateChangeParams) => {
  state = { ...state };

  const tradedDate = formatDate(date?.valueOf().toString() ?? '');
  const nextTradedDate = getNextTradedDate(tradedDate, false, rangeMoment);
  const todayNextTradedDate = getNextTradedDate(today, false, rangeMoment);

  state.tradedDate = tradedDate;

  // 交易日变更时，需要同时变更交易日偏移值
  if (tradedDate === today) {
    // 如果为今天，则选中偏移选项中的今天
    state.tradedDateOffset = DateOffsetEnum.PLUS_0;
  } else if (tradedDate === todayNextTradedDate) {
    // 如果为今天的下一个交易日，则选中偏移选项中的明天
    state.tradedDateOffset = DateOffsetEnum.PLUS_1;

    // 如果是未上市债券，则又不选中偏移值
    if (unlisted) state.tradedDateOffset = undefined;
  } else {
    state.tradedDateOffset = undefined;
  }

  // 当交易日改变时，如果当前有选中交割日的偏移值，使用已选中交割日的偏移值计算新的交割日并联动改变
  switch (state.deliveryDateOffset) {
    // 如果为 T+0，则选中日期选择器中的与交易日偏离值为 0 的交割日，即交易日当天
    case DateOffsetEnum.PLUS_0:
      state.deliveryDate = tradedDate;
      break;
    // 如果为 T+1，则选中日期选择器中的与交易日偏离值为 1 的交割日，即下一个交易日
    // 如果没有选中交割日的 offset，则默认使用 T+1 计算新的交割日
    // case DateOffsetEnum.PLUS_1:
    default:
      state.deliveryDateOffset = DateOffsetEnum.PLUS_1;
      state.deliveryDate = nextTradedDate;
      break;
  }

  return state;
};

export const changeTradedOffset = ({
  unlisted,
  today = '',
  rangeMoment = dealDateManager.getDealDateMomentRange(),
  state,
  offset
}: DealDateChangeParams) => {
  state = { ...state };

  state.tradedDateOffset = offset;

  let tradedDate = formatDate(state.tradedDate);
  const todayNextTradedDate = getNextTradedDate(today, false, rangeMoment);

  /** 今天不是交易日 */
  const todayIsNotTradedDate = isDisabledDealDate(today, rangeMoment);

  // 交易日偏移值变更，导致交易日跟随变更逻辑
  switch (offset) {
    // 如果为今天，则选中日期选择器中的今天
    case DateOffsetEnum.PLUS_0:
      // 如果今天为非交易日，则选今天的下一个交易日
      if (todayIsNotTradedDate) tradedDate = todayNextTradedDate;
      else tradedDate = today;
      break;
    // 如果为明天，则选中日期选择器中今天的下一个交易日
    case DateOffsetEnum.PLUS_1:
      // 如果选择了未上市的债券，则选「明天」时，也要为今天的日期
      if (unlisted) tradedDate = today;
      else tradedDate = todayNextTradedDate;
      break;
    default:
      break;
  }

  state.tradedDate = tradedDate;

  // 当交易日改变时，如果当前有选中交割日的偏移值，使用已选中交割日的偏移值计算新的交割日并联动改变
  switch (state.deliveryDateOffset) {
    // 如果为 T+0，则选中日期选择器中的与交易日偏离值为 0 的交割日，即交易日当天
    case DateOffsetEnum.PLUS_0:
      state.deliveryDate = tradedDate;
      break;
    // 如果为 T+1，则选中日期选择器中的与交易日偏离值为 1 的交割日，即下一个交易日
    // 如果没有选中交割日的 offset，则默认使用 T+1 计算新的交割日
    // case DateOffsetEnum.PLUS_1:
    default: {
      const nextTradedDate = getNextTradedDate(tradedDate, false, rangeMoment);

      state.deliveryDateOffset = DateOffsetEnum.PLUS_1;
      state.deliveryDate = nextTradedDate;
      break;
    }
  }

  return state;
};

export const changeDeliveryDate = ({ rangeMoment, state, date }: DealDateChangeParams) => {
  state = { ...state };

  const tradedDate = formatDate(state.tradedDate);
  const nextTradedDate = getNextTradedDate(tradedDate, false, rangeMoment);
  let deliveryDate = formatDate(date?.valueOf().toString() ?? '');

  // 如果当前交割日早与当前交易日，需要提示并根据已选择的结算方式重新计算交割日
  if (date?.isBefore(moment(tradedDate), 'day')) {
    // 当交易日改变时，如果当前有选中交割日的 offset，使用已选中交割日的 offset 计算新的交割日并联动改变
    switch (state.deliveryDateOffset) {
      // 如果为 T+0，则选中日期选择器中的与交易日偏离值为 0 的交割日，即交易日当天
      case DateOffsetEnum.PLUS_0:
        deliveryDate = tradedDate;
        break;
      // 如果为 T+1，则选中日期选择器中的与交易日偏离值为 1 的交割日，即下一个交易日
      // 如果没有选中交割日的 offset，则默认使用 T+1 计算新的交割日
      // case DateOffsetEnum.PLUS_1:
      default:
        state.deliveryDateOffset = DateOffsetEnum.PLUS_1;
        deliveryDate = nextTradedDate;
        break;
    }
    message.warning('交易日不可晚于交割日！');
  } else if (deliveryDate === tradedDate) {
    // 如果交割日与交易日相同，则选中偏移选项中的 T+0
    state.deliveryDateOffset = DateOffsetEnum.PLUS_0;
  } else if (deliveryDate === nextTradedDate) {
    // 如果为交易日的下一天，则选中偏移选项中的 T+1
    state.deliveryDateOffset = DateOffsetEnum.PLUS_1;
  } else {
    state.deliveryDateOffset = undefined;
  }

  state.deliveryDate = deliveryDate;

  return state;
};

export const changeDeliveryOffset = ({ rangeMoment, state, offset }: DealDateChangeParams) => {
  state = { ...state };

  state.deliveryDateOffset = offset;

  const tradedDate = formatDate(state.tradedDate);
  const nextTradedDate = getNextTradedDate(tradedDate, false, rangeMoment);

  // 交割日偏离值变更，导致交割日跟随变更逻辑
  switch (offset) {
    // 如果为 T+0，则选中日期选择器中的与交易日偏离值为 0 的交割日，即交易日当天
    case DateOffsetEnum.PLUS_0:
      state.deliveryDate = tradedDate;
      break;
    // 如果为 T+1，则选中日期选择器中的与交易日偏离值为 1 的交割日，即下一个交易日
    case DateOffsetEnum.PLUS_1: {
      state.deliveryDate = nextTradedDate;
      break;
    }
    default:
      break;
  }

  return state;
};

export const getLiqSpeed = (range: string[], state: DealDateMutationState): LiquidationSpeed => {
  const tradeDay = formatDate(state.tradedDate);
  const deliveryDay = formatDate(state.deliveryDate);
  const tradeDateRangeMap = range.map(d => formatDate(d));

  return {
    date: moment(tradeDay).valueOf().toString(),
    offset: tradeDateRangeMap.indexOf(deliveryDay) - tradeDateRangeMap.indexOf(tradeDay)
  };
};

/** 使用上市日获取选择「今天」时的日期 */
export const getTodayByListedDate = (listedDate?: string) => {
  let today = `${+Date.now()}`;
  let unlisted = false;

  // 如果上市日晚于今天，需要把上市日当作今天
  if (listedDate && moment(formatDate(listedDate)).isAfter(moment(), 'day')) {
    today = listedDate;
    unlisted = true;
  }

  return { today, unlisted };
};

export const getEarlierDate = (date1: string, date2: string) => {
  const momentDate1 = moment(normalizeTimestamp(date1));
  const momentDate2 = moment(normalizeTimestamp(date2));

  return momentDate1.isBefore(momentDate2) ? date1 : date2;
};
