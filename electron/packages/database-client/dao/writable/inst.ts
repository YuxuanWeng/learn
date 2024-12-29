import { InstSync } from '@fepkg/services/types/common';
import { logger } from '../../../../utility-process/data-localization/utils';
import { instSql } from '../../sql/inst';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getInstDeleteParams, getInstUpsertParams } from './utils';

export class InstWritableDao extends BaseDao implements Writable<InstSync> {
  createTable() {
    return this.databaseClient.run(instSql.createTable);
  }

  dropTable() {
    logger.e({ keyword: 'Inst_dropTable' }, { immediate: true });
    return this.databaseClient.run(instSql.dropTable);
  }

  upsertList(list: InstSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame('run', instSql.upsert, list.map(getInstUpsertParams));
  }

  deleteList(list: InstSync[]) {
    if (!list.length) return [];
    logger.e({ keyword: 'Inst_deleteList', total: list.length, list: list.map(i => i.inst_id) }, { immediate: true });
    return this.databaseClient.prepareSame<{ inst_id: string }>('all', instSql.remove, list.map(getInstDeleteParams));
  }

  hardDeleteDisabled() {
    logger.w({ keyword: 'Inst_hardDeleteDisabled' }, { immediate: true });
    return this.databaseClient.run(instSql.hardDeleteDisabledList);
  }
}
