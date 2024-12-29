import { TraderSync } from '@fepkg/services/types/common';
import { logger } from '../../../../utility-process/data-localization/utils';
import { traderSql } from '../../sql/trader';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getTraderDeleteParams, getTraderUpsertParams } from './utils';

export class TraderWritableDao extends BaseDao implements Writable<TraderSync> {
  createTable() {
    return this.databaseClient.run(traderSql.createTable);
  }

  dropTable() {
    logger.e({ keyword: 'Trader_dropTable' }, { immediate: true });
    return this.databaseClient.run(traderSql.dropTable);
  }

  upsertList(list: TraderSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame('run', traderSql.upsert, list.map(getTraderUpsertParams));
  }

  deleteList(list: TraderSync[]) {
    if (!list.length) return [];
    logger.e(
      { keyword: 'Trader_deleteList', total: list.length, list: list.map(i => i.broker_ids) },
      { immediate: true }
    );
    return this.databaseClient.prepareSame<{ trader_id: string }>(
      'all',
      traderSql.remove,
      list.map(getTraderDeleteParams)
    );
  }

  hardDeleteDisabled() {
    logger.w({ keyword: 'Trader_hardDeleteDisabled' }, { immediate: true });
    return this.databaseClient.run(traderSql.hardDeleteDisabledList);
  }
}
