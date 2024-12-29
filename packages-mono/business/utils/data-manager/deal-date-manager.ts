import { InMemoryLocalStorage } from '@fepkg/common/utils/cache';
import { normalizeTimestamp } from '@fepkg/common/utils/date';
import { message } from '@fepkg/components/Message';
import { fetchWeekdayList } from '@fepkg/services/api/base-data/weekday-list-get';
import moment, { Moment } from 'moment';
import { DEAL_TRADED_DATE_RANGE, TRADED_DATE_RANGE_KEY } from '../../hooks/useTradedDateRange';
import { getRangerByMouth } from '../date';

const formatFn = (range?: string[]) => {
  return range?.map(i => moment(normalizeTimestamp(i)));
};

// fetchNextWeekday, 单条的兜底接口
// mulFetchNextWeekday, 多条的兜底接口
export class DealDateManager extends InMemoryLocalStorage<string[], Moment[]> {
  private lastIMouthDay: string;

  private nextJMouthDay: string;

  private isInitializing?: boolean;

  constructor(start: number, end: number) {
    const [lastIMouthDay, nextJMouthDay] = getRangerByMouth(start, end);
    const newKey = `${TRADED_DATE_RANGE_KEY}-${lastIMouthDay}-${nextJMouthDay}`;

    super(newKey, formatFn);

    this.lastIMouthDay = lastIMouthDay;
    this.nextJMouthDay = nextJMouthDay;
  }

  /** 用于提前缓存前 i 月到后 j 月的工作日信息，本地判断交易日、交割日 */
  async init() {
    if (this.isInitializing) {
      return void 0;
    }
    try {
      this.isInitializing = true;
      const response = await fetchWeekdayList(
        {
          target_date: this.lastIMouthDay,
          count: moment(this.nextJMouthDay).diff(moment(this.lastIMouthDay), 'day'),
          with_today: true
        },
        { hideErrorMessage: true }
      );
      const weekdayList = response?.weekday_list ?? [];

      this.setItem(weekdayList);

      return weekdayList;
    } catch (error) {
      message.error('获取节假日数据失败，请重试！');
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  getDealDateRange(): string[] {
    if (!this.cache.current?.length) {
      message.error('本地节假日数据缺失，请稍后再试');
      this.init();
      return [];
    }

    const range: string[] = this.cache.current ?? [];
    return range;
  }

  getDealDateMomentRange(): Moment[] {
    if (!this.cache.current?.length) {
      message.error('本地节假日数据缺失，请稍后再试');
      this.init();
      return [];
    }

    const range: Moment[] = this.cache.formatted ?? [];
    return range;
  }

  getFirstDealDateOfMonth(): Moment {
    if (!this.cache.current?.length) {
      message.error('本地节假日数据缺失，请稍后再试');
      this.init();
      return moment().startOf('M');
    }

    const currMonthFirstDay = moment().startOf('M');
    const firstDealDateOfMonth: Moment | undefined = this.cache.formatted
      ?.find(item => item.isSame(currMonthFirstDay, 'M'))
      ?.startOf('D');
    return firstDealDateOfMonth ?? currMonthFirstDay;
  }
}
export const dealDateManager = new DealDateManager(...DEAL_TRADED_DATE_RANGE);
