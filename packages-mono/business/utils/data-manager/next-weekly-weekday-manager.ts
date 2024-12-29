import { InMemoryLocalStorage } from '@fepkg/common/utils/index';
import { fetchNextWeeklyWeekday } from '@fepkg/services/api/base-data/next-weekly-weekday-get';
import { IssuerDateType } from '@fepkg/services/types/bds-enum';

export type WeeklyWeekdayMap = { [key in IssuerDateType]?: string };

export const NEXT_WEEKLY_WEEKDAY_KEY = 'next-weekly-weekday';

export const initWeeklyWeekdayMap = (): WeeklyWeekdayMap => {
  return {
    [IssuerDateType.IssuerDateTypeNone]: '',
    [IssuerDateType.IssuerDateTypeToday]: (+new Date(new Date().setHours(0, 0, 0, 0))).toString(),
    [IssuerDateType.IssuerDateTypeRecent]: '0' // '0' 是服务端时间戳默认值，传 '0' 可以清空服务端发行日期
  };
};

export class NextWeeklyWeekdayManager extends InMemoryLocalStorage<WeeklyWeekdayMap> {
  private isInitializing?: boolean;

  async init() {
    if (this.isInitializing) {
      return void 0;
    }
    try {
      this.isInitializing = true;
      const map = initWeeklyWeekdayMap();
      const { weekly_weekday = [] } = await fetchNextWeeklyWeekday({});

      for (const item of weekly_weekday) {
        map[item.weekday_type] = item.next_weekday;
      }

      this.setItem(map);

      return map;
    } catch (error) {
      // TODO sentry catch
      console.log('fetchNextWeeklyWeekday error', error);

      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  getNextWeeklyWeekday(): WeeklyWeekdayMap {
    if (!this.cache.current) {
      // TODO sentry catch
      console.log('getNextWeeklyWeekday error');
      this.init();
      return {};
    }

    const map: WeeklyWeekdayMap = this.cache.current ?? [];
    return map;
  }
}
export const nextWeeklyWeekdayManager = new NextWeeklyWeekdayManager(NEXT_WEEKLY_WEEKDAY_KEY);
