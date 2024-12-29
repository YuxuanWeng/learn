import { ProductType } from '@fepkg/services/types/bdm-enum';
import { LocalConfigParam } from 'app/packages/database-client/types';
import { isEqual } from 'lodash-es';
import { TableConfigWritableDao } from '../../database-client/dao/writable/table-config';
import { RealtimeServiceConfig } from '../types';

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
export class TableConfigService {
  private tableConfigDao: TableConfigWritableDao;

  constructor(config: RealtimeServiceConfig) {
    const { databaseClient } = config;
    this.tableConfigDao = new TableConfigWritableDao(databaseClient);
  }

  private getCreateTableTime() {
    return this.tableConfigDao.getCreateTableTime();
  }

  public createTable() {
    this.tableConfigDao.createTable();
  }

  public dropTable() {
    this.tableConfigDao.dropTable();
  }

  public getTableConfig() {
    return this.tableConfigDao.getTableConfig();
  }

  public needReset(refreshData: boolean, curTableVersion: number, curUserId: string, userProductType: ProductType[]) {
    const {
      version: tableVersion,
      userId: lastUser,
      userProductType: lastUserProductType
    } = this.getTableConfig() ?? {};
    const createTime = this.getCreateTableTime();
    if (createTime && Date.now() - createTime > ONE_WEEK) {
      return true;
    }

    if (
      refreshData ||
      !tableVersion ||
      tableVersion !== curTableVersion ||
      !lastUser ||
      lastUser !== curUserId ||
      !lastUserProductType ||
      !isEqual(lastUserProductType, userProductType)
    ) {
      // console.log(lastUser, curUserId, 'DataInitSyncStateChange', tableVersion, curTableVersion);
      return true;
    }
    return false;
  }

  public setTableConfig(localConfig: LocalConfigParam) {
    return this.tableConfigDao.setUserConfig(localConfig);
  }
}
