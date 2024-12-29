import { BondDetailSync } from '@fepkg/services/types/common';
import { logger } from '../../../../utility-process/data-localization/utils';
import { bondDetailSql } from '../../sql/bond_detail';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getBondDetailDeleteParams, getBondDetailUpsertParams } from './utils';

export class BondDetailWritableDao extends BaseDao implements Writable<BondDetailSync> {
  createTable() {
    return this.databaseClient.run(bondDetailSql.createTable);
  }

  dropTable() {
    logger.e({ keyword: 'BondDetail_dropTable' }, { immediate: true });
    return this.databaseClient.run(bondDetailSql.dropTable);
  }

  upsertList(list: BondDetailSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame('run', bondDetailSql.upsert, list.map(getBondDetailUpsertParams));
  }

  deleteList(list: BondDetailSync[]) {
    if (!list.length) return [];
    logger.w(
      { keyword: 'BondDetail_deleteList', total: list.length, list: list.map(i => i.key_market) },
      { immediate: true }
    );
    return this.databaseClient.prepareSame<{ ficc_id: string; key_market: string }>(
      'all',
      bondDetailSql.remove,
      list.map(getBondDetailDeleteParams)
    );
  }

  hardDeleteDisabled() {
    logger.w({ keyword: 'BondDetail_hardDeleteDisabled' }, { immediate: true });
    return this.databaseClient.run(bondDetailSql.hardDeleteDisabledList);
  }
}
