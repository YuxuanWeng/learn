import { useMemo } from 'react';
import { DEAL_TRADED_DATE_RANGE, useTradedDateRange } from '@fepkg/business/hooks/useTradedDateRange';
import moment from 'moment';

/** 转换为第前 n 个工作日, n < 15 */
export const transform2PrevWorkingDate = (n: number, list?: string[]) => {
  const index = list?.findIndex(item => moment(+item).isSame(moment(), 'day')) ?? -1;
  const target = index - (n - 1);
  if (index > -1 && target >= 0 && list?.[target]) {
    return moment(+list[target]);
  }
  // 以下为有人在周六日打开 OMS 的情况 - -
  const day = list?.at(-n);
  if (day) return moment(+day);
  return moment();
};

/** 获取 ls 中第前 n 个工作日，0 <= n <= 15 */
export const usePrevWorkingDate = (n = 15) => {
  const [tradeDateRange] = useTradedDateRange(...DEAL_TRADED_DATE_RANGE);
  const value = useMemo(
    () => transform2PrevWorkingDate(Math.max(Math.min(n, 15), 0), tradeDateRange),
    [n, tradeDateRange]
  );
  return [value, tradeDateRange] as const;
};
