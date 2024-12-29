import { parseJSON } from '@fepkg/common/utils';
import { SyncDataType } from '@fepkg/services/types/enum';
import squel from 'squel';
import { LocalConfigDb, LocalConfigParam } from '../../types';
import { BaseDao } from '../base';

export const LOCAL_LAST_SUCCESS_SYNC_VERSION = 'LOCAL_LAST_SUCCESS_SYNC_VERSION';
export const LOCAL_VERSION = 'LOCAL_VERSION';
export const LOCAL_CREATE_TIME = 'LOCAL_CREATE_TIME';

export class TableConfigReadableDao extends BaseDao {
  getTableConfig(): LocalConfigParam | undefined {
    const queryList = squel.select().from('table_config').where('table_title = ?', LOCAL_VERSION);
    const record = this.databaseClient.get<LocalConfigDb | undefined>(queryList.toString());
    if (!record) return undefined;
    return parseJSON<LocalConfigParam>(record.table_config_str);
  }

  getLastSuccessVersion(syncDataType: SyncDataType): string | undefined {
    const queryList = squel
      .select()
      .from('table_config')
      .where('table_title = ?', LOCAL_LAST_SUCCESS_SYNC_VERSION + syncDataType);

    const record = this.databaseClient.get<LocalConfigDb | undefined>(queryList.toString());
    if (!record) return undefined;

    // 兜底逻辑，防止本地业务库不存在table_config表中的sync_version
    if (syncDataType === SyncDataType.SyncDataTypeBondDetail) {
      const versionCountQuery = squel
        .select()
        .field('count(*)', 'total')
        .from('bond_detail')
        .where('sync_version = ?', record.table_config_str);
      const { total } = this.databaseClient.get<{ total: number }>(versionCountQuery.toString()) ?? {};

      return total ? String(record.table_config_str) : undefined;
    }
    return String(record.table_config_str);
  }

  getCreateTableTime(): number | undefined {
    const queryList = squel.select().from('table_config').where('table_title = ?', LOCAL_CREATE_TIME);
    const record = this.databaseClient.get<LocalConfigDb | undefined>(queryList.toString());
    if (!record) return undefined;
    return Number(record.table_config_str);
  }
}
