import { formatDate } from '@fepkg/common/utils/date';
import { LiquidationSpeed } from '@fepkg/services/types/bds-common';
import { LiquidationSpeedTag } from '@fepkg/services/types/enum';
import moment from 'moment';
import { LiquidationSpeedTagMap } from '../constants/map';
import { getNextTradedDate } from '../hooks/useDealDateMutation';
import { dealDateManager } from './data-manager/deal-date-manager';

/** 将单个结算方式转传成字符串： 2023-09-01+1， 周三+1，+1，+0 */
export const liquidationSpeedToString = (liquidationSpeed: LiquidationSpeed, format = 'YYYY-MM-DD') => {
  let returnValue = '';
  const dateStr = liquidationSpeed.date;
  // 如果dateStr有值，那就是日期 +0/+1 的格式, 否则就是标签 +0/+1的格式
  if (dateStr) {
    const datePart = moment(Number(dateStr)).format(format);
    returnValue += datePart;
  } else {
    const tagPart = LiquidationSpeedTagMap[liquidationSpeed.tag ?? ''] ?? '';
    returnValue += tagPart;
  }
  returnValue += `+${liquidationSpeed.offset || 0}`;

  return returnValue;
};

/**
 * 将交易日和交割日转换成结算方式格式，要使用该方法请确保在 HomeLayout 中引入了 useTradedDateRange
 * @param tradedDate 交易日
 * @param deliveryDate 交割日
 * @param showTomorrow 是否显示“明天”tag，为false时则会把明天显示为日期
 * @param showToday 是否显示“今天”tag，为false时则会把今天显示为日期
 * @returns {tag:'',offset:'',date:''}
 */
export const getSettlement = (
  tradedDate: string,
  deliveryDate: string,
  showTomorrow = false,
  showToday = false
): LiquidationSpeed => {
  const today = moment().startOf('day').valueOf();

  const range = dealDateManager.getDealDateRange();

  const tomorrow = moment(getNextTradedDate(formatDate(today))).valueOf();

  const startIndex = range.findIndex(i => i === tradedDate);
  const endIndex = range.findIndex(i => i === deliveryDate);

  const theDayAfterTomorrow = moment(Number(tomorrow)).add(1, 'day').valueOf().toString();

  const offset = endIndex - startIndex;
  let tag;
  let date;

  // 如果交易日是今天
  if (Number(tradedDate) >= today && Number(tradedDate) < tomorrow && offset < 2 && showToday)
    tag = LiquidationSpeedTag.Today;
  // 交易日是明天
  else if (Number(tradedDate) >= tomorrow && tradedDate < theDayAfterTomorrow && offset < 2 && showTomorrow)
    tag = LiquidationSpeedTag.Tomorrow;
  else date = tradedDate;

  return { tag, offset, date };
};
