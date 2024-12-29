import { RestDayToWorkday } from '@fepkg/services/types/common';
import moment from 'moment';
import { holidaySql } from '../../sql/holiday';
import { BaseDao } from '../base';
import { Readable } from '../readable';
import { isNumber } from './utils';

/** 全局节假日缓存 */
let cibHolidayList: number[] | undefined;

let sseHolidayList: number[] | undefined;

let szeHolidayList: number[] | undefined;

const daysToWorkday = (date: number | string, list: number[]) => {
  let rest = 0;
  const day = moment(date);

  if (day.valueOf() > list[list.length - 1]) {
    switch (day.weekday()) {
      case 6:
        return 2;
      case 0:
        return 1;
      default:
        return 0;
    }
  }

  while (list.includes(day.valueOf()) && rest <= 14) {
    day.add(1, 'day');
    rest += 1;
  }
  return rest;
};

export class HolidayReadableDao extends BaseDao implements Readable {
  private static isCacheInit() {
    return !!cibHolidayList && !!sseHolidayList && !!szeHolidayList;
  }

  private initCache() {
    if (!cibHolidayList) {
      const result = this.databaseClient.all<{ holiday_date: string }[]>(holidaySql.getHolidaysByMarketType, {
        market_type: 'CIB'
      });
      cibHolidayList = result.map(v => Number(v.holiday_date));
    }
    if (!sseHolidayList) {
      const result = this.databaseClient.all<{ holiday_date: string }[]>(holidaySql.getHolidaysByMarketType, {
        market_type: 'SSE'
      });
      sseHolidayList = result.map(v => Number(v.holiday_date));
    }
    if (!szeHolidayList) {
      const result = this.databaseClient.all<{ holiday_date: string }[]>(holidaySql.getHolidaysByMarketType, {
        market_type: 'SZE'
      });
      szeHolidayList = result.map(v => Number(v.holiday_date));
    }
  }

  protected getRestDayToWorkday(maturity_date: string): RestDayToWorkday {
    if (!HolidayReadableDao.isCacheInit()) this.initCache();
    if (!maturity_date || !isNumber(maturity_date)) return {};
    const maturityDate = moment(+maturity_date).hour(0).minute(0).second(0).millisecond(0).valueOf();

    let days_cib: number | undefined;
    let days_sse: number | undefined;
    let days_sze: number | undefined;

    if (cibHolidayList) {
      days_cib = daysToWorkday(maturityDate, cibHolidayList);
    }
    if (sseHolidayList) {
      days_sse = daysToWorkday(maturityDate, sseHolidayList);
    }
    if (szeHolidayList) {
      days_sze = daysToWorkday(maturityDate, szeHolidayList);
    }
    return { days_cib, days_sse, days_sze };
  }

  getRestDayToWorkdayList(
    maturityDateList: string[]
  ): { maturity_date: string; rest_day_to_workday: RestDayToWorkday }[] | undefined {
    if (!maturityDateList || !maturityDateList.length) return void 0;

    return maturityDateList?.map(date => ({
      maturity_date: date,
      rest_day_to_workday: this.getRestDayToWorkday(date)
    }));
  }

  getRestDayToWorkdayMap(maturityDateSet: Set<string>) {
    const restDayToWorkdayMap = new Map<string, RestDayToWorkday>();
    const restDayToWorkdayList = this.getRestDayToWorkdayList(Array.from(maturityDateSet));
    restDayToWorkdayList?.forEach(value => restDayToWorkdayMap.set(value.maturity_date, value.rest_day_to_workday));
    return restDayToWorkdayMap;
  }

  getLastVersion(): string | undefined {
    const result = this.databaseClient.get<{ sync_version: string } | undefined>(holidaySql.getLastVersion);
    return result?.sync_version;
  }

  getTotal(): number {
    const result = this.databaseClient.get<{ total: number }>(holidaySql.getTotal);
    return result.total;
  }
}
