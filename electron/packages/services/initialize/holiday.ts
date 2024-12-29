import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { InitializeService } from '../initialize';
import { InitializeServiceConfig } from '../types';

export class HolidayService extends InitializeService {
  constructor(config: InitializeServiceConfig) {
    super({ ...config, syncDataTypeList: Service2SyncDataTypeMap[ServiceType.HolidayService] });
  }
}
