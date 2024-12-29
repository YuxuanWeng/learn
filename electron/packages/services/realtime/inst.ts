import type { LocalInstSearch } from '@fepkg/services/types/data-localization-manual/inst/search';
import { InstReadableDao } from '../../database-client/dao/readable/inst';
import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { RealtimeService } from '../realtime';
import { RealtimeServiceConfig } from '../types';
import { formatInstSync2InstitutionTiny } from '../utils';

export class InstService extends RealtimeService {
  private instDao: InstReadableDao;

  constructor(config: RealtimeServiceConfig) {
    super({
      ...config,
      syncDataTypeList: Service2SyncDataTypeMap[ServiceType.InstService]
    });
    const { databaseClient } = config;
    this.instDao = new InstReadableDao(databaseClient);
  }

  search(params: LocalInstSearch.Request): LocalInstSearch.Response {
    const fuzzyResult = this.instDao.fuzzySearch(params);
    const { list: instList } = fuzzyResult;
    const resultList = instList?.map(formatInstSync2InstitutionTiny);

    return {
      list: resultList
    };
  }
}
