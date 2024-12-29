import { SyncDataType } from '@fepkg/services/types/enum';
import { tableConfigSql } from 'app/packages/database-client/sql/table_config';
import { LocalConfigParam } from 'app/packages/database-client/types';
import squel from 'squel';
import {
  LOCAL_CREATE_TIME,
  LOCAL_LAST_SUCCESS_SYNC_VERSION,
  LOCAL_VERSION,
  TableConfigReadableDao
} from '../readable/table-config';

export class TableConfigWritableDao extends TableConfigReadableDao {
  createTable() {
    const tableExist = !!this.databaseClient.get(tableConfigSql.checkTableExist);
    const res = this.databaseClient.run(tableConfigSql.createTable);

    // 当真实创建表时记录建表时间
    if (!tableExist) {
      this.setCreateTime(Date.now());
    }
    return res;
  }

  dropTable() {
    return this.databaseClient.run(tableConfigSql.dropTable);
  }

  private update(table_title: string, table_config_str: string) {
    return this.databaseClient.prepareSame('run', tableConfigSql.upsert, [
      {
        table_title,
        table_config_str
      }
    ]);
  }

  private setCreateTime(create_time: number) {
    return this.update(LOCAL_CREATE_TIME, String(create_time));
  }

  setUserConfig(localConfigParam: LocalConfigParam) {
    const localConfigParamStr = JSON.stringify(localConfigParam);
    return this.update(LOCAL_VERSION, localConfigParamStr);
  }

  setSyncVersion(syncDataType: SyncDataType, syncVersion: string) {
    return this.update(LOCAL_LAST_SUCCESS_SYNC_VERSION + syncDataType, syncVersion);
  }

  deleteSyncVersion(syncDataType: SyncDataType) {
    const query = squel
      .delete()
      .from('table_config')
      .where('table_title = ?', LOCAL_LAST_SUCCESS_SYNC_VERSION + syncDataType);
    // console.log(query.toString(), 'query.toString()');
    return this.databaseClient.run(query.toString());
  }
}
