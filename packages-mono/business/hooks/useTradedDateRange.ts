import { useMemo } from 'react';
import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import { getRangerByMouth } from '@fepkg/business/utils/date';

export const TRADED_DATE_RANGE_KEY = 'trade-date-range';

/** 数据存储前 3 月到后 ( 2 年 + 1月 )的工作日时间 */
export const DEAL_TRADED_DATE_RANGE = [3, 25] as const;

/** 获取 ls 中前 i 月到后 j 月的工作日信息，本地判断交易日、交割日 */
export const useTradedDateRange = (i: number, j: number) => {
  const [lastIMouthDay, nextJMouthDay] = useMemo(() => {
    return getRangerByMouth(i, j);
  }, [i, j]);
  return useLocalStorage<string[]>(`${TRADED_DATE_RANGE_KEY}-${lastIMouthDay}-${nextJMouthDay}`, []);
};
