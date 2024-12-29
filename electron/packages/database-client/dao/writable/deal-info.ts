import { DealInfoSync } from '@fepkg/services/types/common';
import { dealInfoSql } from '../../sql/deal_info';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getDealInfoDeleteParams, getDealInfoUpsertParams } from './utils';

export class DealInfoWritableDao extends BaseDao implements Writable<DealInfoSync> {
  createTable() {
    return this.databaseClient.run(dealInfoSql.createTable);
  }

  dropTable() {
    return this.databaseClient.run(dealInfoSql.dropTable);
  }

  upsertList(list: DealInfoSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame('run', dealInfoSql.upsert, list.map(getDealInfoUpsertParams));
  }

  deleteList(list: DealInfoSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame<{ deal_id: string }>(
      'all',
      dealInfoSql.remove,
      list.map(getDealInfoDeleteParams)
    );
  }

  hardDeleteDisabled() {
    return this.databaseClient.run(dealInfoSql.hardDeleteDisabledList);
  }
}
