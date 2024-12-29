import { errorToString } from '@fepkg/common/utils';
import { SyncDataType } from '@fepkg/services/types/enum';
import { trackPoint } from '../../utility-process/data-localization/utils';
import { DataInitManager } from '../data-sync-manager/init';
import { EventClientChannel } from '../event-client/types';
import { BaseService } from './base';
import { AbstractInitializeServiceConfig } from './types';

// const DEFAULT_FIRST_RETRY_TIME = 10 * 1000;
export class InitializeService extends BaseService {
  protected dataClientMap = new Map<SyncDataType, DataInitManager>();

  // private retryCount = 0;

  constructor(config: AbstractInitializeServiceConfig) {
    super(config);
    const { syncDataTypeList, eventClient, requestClient, databaseClient, userProductType } = config;
    syncDataTypeList.forEach(type =>
      this.dataClientMap.set(
        type,
        new DataInitManager({
          syncDataType: type,
          requestClient,
          eventClient,
          databaseClient,
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
  // }

  isServiceAvailable() {
    return this.isServiceBasicAvailable();
  }

  startSync(needReset: boolean) {
    if (this.isServiceInitializing()) {
      throw new Error('QuoteService has started update data!');
    }

    // 已经初始化并且无错误
    if (this.isServiceBasicAvailable()) {
      // 向渲染进程发消息
      for (const syncDataType of this.dataClientMap.keys()) {
        this.eventClient.emit(EventClientChannel.DataInitSyncStateChange, {
          syncDataType,
          status: 'success'
        });
      }
      return;
    }

    for (const dataInitClient of this.dataClientMap.values()) {
      dataInitClient.startInit(needReset);
    }
  }

  endSync() {
    for (const dataInitClient of this.dataClientMap.values()) {
      dataInitClient.endSync();
    }
  }

  restart(needReset: boolean) {
    try {
      this.endSync();
      this.startSync(needReset);
    } catch (e) {
      trackPoint({
        keyword: 'restart error',
        error: errorToString(e),
        message: '重启服务失败',
        syncDataTypeList: [...this.dataClientMap.keys()].join(',')
      });
    }
  }
}
