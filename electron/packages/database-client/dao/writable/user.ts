import { UserSync } from '@fepkg/services/types/common';
import { logger } from '../../../../utility-process/data-localization/utils';
import { userSql } from '../../sql/user';
import { BaseDao } from '../base';
import { Writable } from '../writable';
import { getUserDeleteParams, getUserUpsertParams } from './utils';

export class UserWritableDao extends BaseDao implements Writable<UserSync> {
  createTable() {
    return this.databaseClient.run(userSql.createTable);
  }

  dropTable() {
    logger.e({ keyword: 'User_dropTable' }, { immediate: true });
    return this.databaseClient.run(userSql.dropTable);
  }

  upsertList(list: UserSync[]) {
    if (!list.length) return [];
    return this.databaseClient.prepareSame('run', userSql.upsert, list.map(getUserUpsertParams));
  }

  deleteList(list: UserSync[]) {
    if (!list.length) return [];
    logger.e({ keyword: 'User_deleteList', total: list.length, list: list.map(i => i.user_id) });
    return this.databaseClient.prepareSame<{ user_id: string }>('all', userSql.remove, list.map(getUserDeleteParams));
  }

  hardDeleteDisabled() {
    logger.w({ keyword: 'User_hardDeleteDisabled' }, { immediate: true });
    return this.databaseClient.run(userSql.hardDeleteDisabledList);
  }
}
