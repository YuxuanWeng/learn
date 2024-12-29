import { SyncDataType } from '@fepkg/services/types/enum';
import { DataInitManager } from '../data-sync-manager/init';
import { EventClient } from '../event-client';
import { AbstractInitializeServiceConfig } from './types';

export abstract class BaseService {
  protected eventClient: EventClient;

  protected abstract dataClientMap: Map<SyncDataType, DataInitManager>;

  constructor(config: AbstractInitializeServiceConfig) {
    const { eventClient } = config;
    this.eventClient = eventClient;
  }

  isServiceInitializing(): boolean {
    const resultList: boolean[] = [];
    for (const dataClient of this.dataClientMap.values()) {
      resultList.push(dataClient.isInitializing());
    }
    return resultList.some(Boolean);
  }

  isServiceBasicAvailable(): boolean {
    const resultList: boolean[] = [];
    for (const dataClient of this.dataClientMap.values()) {
      resultList.push(dataClient.isInitializeFinished());
    }
    return resultList.every(Boolean);
  }

  abstract startSync(needReset: boolean): void;

  abstract endSync(): void;
}
