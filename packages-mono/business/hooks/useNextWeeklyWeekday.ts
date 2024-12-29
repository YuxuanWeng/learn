import { useLocalStorage } from '@fepkg/business/hooks/useLocalStorage';
import {
  NEXT_WEEKLY_WEEKDAY_KEY,
  WeeklyWeekdayMap,
  initWeeklyWeekdayMap
} from '../utils/data-manager/next-weekly-weekday-manager';

/** 获取 ls 中今日后一周期间的第一个工作日 */
export const useNextWeeklyWeekday = () => {
  return useLocalStorage<WeeklyWeekdayMap>(NEXT_WEEKLY_WEEKDAY_KEY, initWeeklyWeekdayMap());
};
