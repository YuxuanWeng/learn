import { formatDate, normalizeTimestamp } from '@fepkg/common/utils/date';
import moment from 'moment';

/** 转换成交日 */
export const transform2DealTime = (deal_time: string) => {
  const date = moment(normalizeTimestamp(deal_time));
  const today = moment();

  const isToday = date.isSame(today, 'date');
  if (isToday) return formatDate(deal_time, 'HH:mm:ss');

  const isSameYear = date.isSame(today, 'year');
  if (isSameYear) return formatDate(deal_time, 'MM-DD HH:mm:ss');

  return formatDate(deal_time, 'YYYY-MM-DD HH:mm:ss');
};
