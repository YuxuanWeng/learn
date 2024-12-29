import { HolidaySync } from '@fepkg/services/types/common';
import { holidaySql } from '../../sql/holiday';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getHolidayDeleteParams, getHolidayUpsertParams } from './utils';

export class HolidayWritableDao extends BaseDao implements Writable<HolidaySync> {
  createTable() {
    return this.databaseClient.run(holidaySql.createTable);
  }

  dropTable() {
    return this.databaseClient.run(holidaySql.dropTable);
  }

  upsertList(list: HolidaySync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame('run', holidaySql.upsert, list.map(getHolidayUpsertParams));
  }

  deleteList(list: HolidaySync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame<{ holiday_id: string }>(
      'all',
      holidaySql.remove,
      list.map(getHolidayDeleteParams)
    );
  }

  hardDeleteDisabled() {
    return this.databaseClient.run(holidaySql.hardDeleteDisabledList);
  }
}
