import { formatDate } from '@fepkg/common/utils/date';
import moment from 'moment';

/** 获取本周周一和周日日期 */
export const getCurrentWeek = (): [string, string] => {
  const today = moment();
  const monday = formatDate(today.weekday(1));
  const sunday = formatDate(today.weekday(7));
  return [monday, sunday];
};

/** 获取前 n 周周一和周日日期 */
export const getLastWeek = (n: number): [string, string] => {
  const today = moment();
  const weekOfDay = parseInt(today.format('E'), 10); // 计算今天是这周第几天
  const monday = formatDate(today.subtract(weekOfDay + 7 * n - 1, 'days'));
  const sunday = formatDate(today.subtract(weekOfDay + 7 * (n - 1), 'days'));
  return [monday, sunday];
};

/** 获取后 n 周周一和周日日期 */
export const getNextWeek = (n: number): [string, string] => {
  const today = moment();
  const weekOfDay = parseInt(today.format('E'), 10); // 计算今天是这周第几天
  const monday = formatDate(today.add(7 - weekOfDay + 7 * (n - 1) + 1, 'days'));
  const sunday = formatDate(today.add(7 - weekOfDay + 7 * n, 'days'));
  return [monday, sunday];
};

/** 获取前 i 月第一天和后 j 月最后一天日期 */
export const getRangerByMouth = (i: number, j: number): [string, string] => {
  const today = moment();
  const firstDay = formatDate(today.subtract(i, 'M').startOf('M'));
  const lastDay = formatDate(today.add(j, 'M').endOf('M'));
  return [firstDay, lastDay];
};
