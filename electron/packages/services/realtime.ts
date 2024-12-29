import { errorToString } from '@fepkg/common/utils';
import { SyncDataType } from '@fepkg/services/types/enum';
import { trackPoint } from 'app/utility-process/data-localization/utils';
import { DataSyncManager } from '../data-sync-manager/sync';
import { EventClientChannel } from '../event-client/types';
import { BaseService } from './base';
import { AbstractRealtimeServiceConfig } from './types';

// const DEFAULT_FIRST_RETRY_TIME = 10 * 1000;

export abstract class RealtimeService extends BaseService {
  protected dataClientMap = new Map<SyncDataType, DataSyncManager>();

  // private retryCount = 0;

  constructor(config: AbstractRealtimeServiceConfig) {
    super(config);
    const { syncDataTypeList, eventClient, requestClient, databaseClient, centrifugeClient, userProductType } = config;
    syncDataTypeList.forEach(type =>
      this.dataClientMap.set(
        type,
        new DataSyncManager({
          syncDataType: type,
          requestClient,
          eventClient,
          databaseClient,
          centrifugeClient,
          userProductType
        })
      )
    );
    // this.onDataError(syncDataTypeList);
  }

  // FIXME: 无法错误密集上报，以及有死循环问题，暂时下线
  // private onDataError(list: SyncDataType[]) {
  //   const handleDataError = (ctx?: DataInitSyncEventMessage) => {
  //     this.endSync();
  //     this.retryCount++;
  //     const { status, syncDataType } = ctx ?? {};
  //     if (status === 'success') {
  //       this.retryCount = 0;
  //       return;
  //     }
  //     if (status === 'error' && this.retryCount < 3) {
  //       if (syncDataType !== undefined && list.includes(syncDataType)) {
  //         setTimeout(() => {
  //           this.restart(true);
  //         }, DEFAULT_FIRST_RETRY_TIME * this.retryCount);
  //       }
  //     }
  //   };
  //   // 数据错误则重启
  //   this.eventClient.on<DataInitSyncEventMessage>(EventClientChannel.DataInitSyncStateChange, handleDataError);
  //   this.eventClient.on<DataRealtimeSyncEventMessage>(EventClientChannel.DataRealtimeSyncStateChange, handleDataError);
  // }

  isServiceSyncError(): boolean {
    const resultList: boolean[] = [];
    for (const dataClient of this.dataClientMap.values()) {
      resultList.push(dataClient.isSyncError());
    }
    return resultList.some(Boolean);
  }

  isServiceAvailable() {
    return this.isServiceBasicAvailable() && !this.isServiceSyncError();
  }

  async startSync(needReset: boolean) {
    if (this.isServiceInitializing()) {
      throw new Error('Service has started update data!');
    }
    // 已经初始化并且无错误
    if (this.isServiceAvailable()) {
      // 向渲染进程发消息
      for (const syncDataType of this.dataClientMap.keys()) {
        this.eventClient.emit(EventClientChannel.DataInitSyncStateChange, {
          syncDataType,
          status: 'success'
        });
      }
      return;
    }

    for await (const dataSyncManager of this.dataClientMap.values()) {
      await dataSyncManager.startInit(needReset);
    }
  }

  endSync() {
    for (const dataSyncManager of this.dataClientMap.values()) {
      dataSyncManager.endSync();
    }
  }

  restart(needReset: boolean) {
    this.endSync();
    this.startSync(needReset).catch(e => {
      trackPoint({
        keyword: 'restart error',
        error: errorToString(e),
        message: '重启服务失败',
        syncDataTypeList: [...this.dataClientMap.keys()].join(',')
      });
    });
  }
}
