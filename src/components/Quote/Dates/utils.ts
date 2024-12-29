import { findLastIndex } from 'lodash-es';
import { BatchGetTreadDayAndDeliDayResponse, Dates, LiquidationSpeedTagItem } from '@/common/types/liq-speed';
import { isEqualWithMomentOfDay } from '@/common/utils/date';

/** 获取冲突标签中需要保留的标签id */
export const getRetainTagIds = (
  conflictDates: Dates[],
  labelDaysMap: (BatchGetTreadDayAndDeliDayResponse | LiquidationSpeedTagItem)[],
  hasCheckedDate = false
) => {
  const conflictLabels = labelDaysMap.filter(label =>
    conflictDates.some(
      date =>
        isEqualWithMomentOfDay(date.deliveryDate, label.deliveryDate) &&
        isEqualWithMomentOfDay(date.tradedDate, label.tradedDate)
    )
  );

  // 当选中日期时造成冲突，且冲突标签数为1时，不保留冲突标签
  if (hasCheckedDate && conflictLabels.length === 1) return [];

  return conflictDates.map(v =>
    findLastIndex(
      labelDaysMap,
      item =>
        isEqualWithMomentOfDay(item.deliveryDate, v.deliveryDate) &&
        isEqualWithMomentOfDay(item.tradedDate, v.tradedDate)
    )
  );
};

/** 获取冲突标签中除保留标签以外的标签 */
export const getConflictLabels = (
  conflictDates: Dates[],
  labelDaysMap: (BatchGetTreadDayAndDeliDayResponse | LiquidationSpeedTagItem)[],
  retainLabelIds: number[]
) => {
  return labelDaysMap.filter(
    (v, i) =>
      conflictDates.some(
        item =>
          isEqualWithMomentOfDay(item.tradedDate, v.tradedDate) &&
          isEqualWithMomentOfDay(item.deliveryDate, v.deliveryDate)
      ) && !retainLabelIds.includes(i)
  );
};

/** 获取数组中重复的项 */
export const getRepeatData = <T>(data: T[]) => {
  const idx: number[] = [];
  const copy: string[] = [];
  for (const [i, v] of data.entries()) {
    if (copy.includes(JSON.stringify(v))) idx.push(i);
    else copy.push(JSON.stringify(v));
  }
  return data.filter((_, i) => idx.includes(i));
};
