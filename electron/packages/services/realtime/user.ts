import type { LocalUserSearch } from '@fepkg/services/types/data-localization-manual/user/search';
import { UserReadableDao } from '../../database-client/dao/readable/user';
import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { RealtimeService } from '../realtime';
import { RealtimeServiceConfig } from '../types';
import { formatUserSync2User } from '../utils';

export class UserService extends RealtimeService {
  private userDao: UserReadableDao;

  constructor(config: RealtimeServiceConfig) {
    super({ ...config, syncDataTypeList: Service2SyncDataTypeMap[ServiceType.UserService] });
    const { databaseClient } = config;
    this.userDao = new UserReadableDao(databaseClient);
  }

  search(params: LocalUserSearch.Request): LocalUserSearch.Response {
    const fuzzyResult = this.userDao.fuzzySearch({ ...params });
    const { list: userList } = fuzzyResult;
    const resultList = userList?.map(formatUserSync2User);

    return {
      list: resultList
    };
  }
}
