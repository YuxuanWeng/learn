import { useEffect, useRef, useState } from 'react';
import { message } from '@fepkg/components/Message';
import { SyncDataType } from '@fepkg/services/types/enum';
import { captureMessage } from '@sentry/react';
import { useLatest, useMemoizedFn } from 'ahooks';
import { DataCheckSyncEventMessage, DataInitSyncEventMessage } from 'app/packages/event-client/types';
import { DataLocalizationAction, DataLocalizationResponse } from 'app/types/DataLocalization';
import { initUtilityProcess } from '@/common/hooks/utility-process/useDataLocalizationPort';
import { fetchLocalServicesStatus } from '@/common/services/api/data-localization-manual/local-service-status';
import { restartLocalServices } from '@/common/services/api/data-localization-manual/restart-local-services';
import { logError } from '@/common/utils/logger/data';
import { trackPoint } from '@/common/utils/logger/point';
import { DataInitProgressStatusType } from '@/components/DataInitProgress';
import { LocalDataError } from './utils';

const InitLocalDataTimerKey = 'init_local_data_timer';
const InitLocalDataErrorKey = 'init_local_data_error';

export const useInitLocalizationData = (params: {
  initSyncDataTypeList?: SyncDataType[];
  isPortAvailable?: boolean;
  isLogin?: boolean;
  manual?: boolean;
}) => {
  const { initSyncDataTypeList = [], isPortAvailable, isLogin = false, manual = false } = params;

  const [initSyncStatus, setInitSyncStatus] = useState<DataInitProgressStatusType>('none');
  const latestInitStatusRef = useLatest<DataInitProgressStatusType>(initSyncStatus);
  const checkCount = useRef(0);

  // const [displayText, setDisplayText] = useState('数据加载中，进度');
  const [initSyncProgress, setInitSyncProgress] = useState(0);

  const initSuccessDataTypeList = useRef<SyncDataType[]>([]);
  const errorServiceList = useRef<SyncDataType[]>([]);

  const progressTimer = useRef<NodeJS.Timeout>();
  const checkTimer = useRef<NodeJS.Timeout>();

  const realtimeSyncOff = useRef<VoidFunction>();
  const initDataOff = useRef<VoidFunction>();

  const onLoadingError = () => {
    setInitSyncStatus('error');
    clearInterval(progressTimer.current);
    clearTimeout(checkTimer.current);
    realtimeSyncOff.current?.();
    initDataOff.current?.();
  };

  const initDataLoading = useMemoizedFn(async (syncDataTypeList?: SyncDataType[]) => {
    const startTime = performance.now();

    setInitSyncProgress(0);
    setInitSyncStatus('loading');
    // setDisplayText('数据加载中，进度');
    realtimeSyncOff.current?.();
    initDataOff.current?.();
    message.destroy();

    const { available_sync_data_type = [], error_sync_data_type = [] } = !isLogin
      ? await fetchLocalServicesStatus().catch(e => {
          onLoadingError();
          return Promise.reject(e);
        })
      : {};

    if (!isLogin && error_sync_data_type.length > 0) {
      await restartLocalServices({
        syncDataTypeList: error_sync_data_type
      });
    }

    // 优先使用syncDataTypeList, 默认为hook的initSyncDataTypeList
    const curSyncDataTypeList = (syncDataTypeList ?? initSyncDataTypeList).filter(item => {
      // 过滤已完成初始化的类型
      return !available_sync_data_type.includes(item);
    });

    return new Promise<void>((resolve, reject) => {
      const success = () => {
        setInitSyncProgress(100);
        setInitSyncStatus('success');
        // setDisplayText('数据本地化成功！');
        clearInterval(progressTimer.current);
        clearTimeout(checkTimer.current);
        realtimeSyncOff.current?.();
        initDataOff.current?.();
        checkCount.current = 0;

        // 初始化与等待同步数据后才toast
        if (!isLogin && curSyncDataTypeList.length) {
          // message.success('数据本地化成功！');
        }

        trackPoint(InitLocalDataTimerKey, InitLocalDataTimerKey, {
          duration: performance.now() - startTime,
          initDataType: syncDataTypeList ?? initSyncDataTypeList,
          curSyncDataTypeList
        });
        resolve();
      };

      progressTimer.current = setInterval(() => {
        setInitSyncProgress(value => {
          if (value < 98) {
            return value + 0.1;
          }
          clearInterval(progressTimer.current);
          return value;
        });
      }, 100);

      if (curSyncDataTypeList.length === 0) {
        success();
      }

      const handleSyncStateChange = (
        ctx?: DataLocalizationResponse<DataCheckSyncEventMessage | DataInitSyncEventMessage>
      ) => {
        const { status, syncDataType, message: msg } = ctx?.value ?? {};
        if (
          syncDataType === SyncDataType.SyncDataTypeNone ||
          (syncDataType && curSyncDataTypeList.includes(syncDataType))
        ) {
          switch (status) {
            case 'success': {
              // 进度条更新
              initSuccessDataTypeList.current.push(syncDataType);

              // 判断是否同步成功
              if (curSyncDataTypeList.filter(Boolean).every(type => initSuccessDataTypeList.current.includes(type))) {
                // 判断收到实时同步成功的消息后需要确认下初始化是否完成，初始化成功也可以做双重保险
                fetchLocalServicesStatus()
                  .then(list => {
                    if (list.available_sync_data_type?.includes(syncDataType)) {
                      success();
                    }
                  })
                  .catch(() => {
                    reject(new LocalDataError('查询本地可用服务失败，请联系管理员处理！'));
                  });
              }
              break;
            }
            case 'error': {
              if (!isLogin) {
                // 初始化时不要toast
                // message.error(msg ?? '数据同步失败，请重试或联系管理员处理！', 0);
              }
              setInitSyncStatus('error');
              // setDisplayText('数据同步失败，进度');
              clearInterval(progressTimer.current);
              clearInterval(checkTimer.current);
              realtimeSyncOff.current?.();
              initDataOff.current?.();

              errorServiceList.current.push(syncDataType);
              captureMessage(msg ?? 'Init sync error.', { extra: { ctx } });
              logError({ keyword: InitLocalDataErrorKey, error: ctx, syncDataType }, true);
              reject(new LocalDataError(msg ?? 'Init sync error.'));
              break;
            }
            default:
              break;
          }
        }
      };

      // 断网后数据未恢复时打开需要本地化数据的页面时也需要监success
      realtimeSyncOff.current = window.UtilityProcess?.on<DataCheckSyncEventMessage>(
        DataLocalizationAction.RealtimeSyncStateChange,
        handleSyncStateChange
      );

      initDataOff.current = window.UtilityProcess?.on<DataInitSyncEventMessage>(
        DataLocalizationAction.InitSyncStateChange,
        handleSyncStateChange
      );

      if (isLogin) {
        // 初始化UtilityProcess任务, 只在登录页start
        initUtilityProcess();
      }

      const checkStatusFn = () => {
        const needDataList = syncDataTypeList ?? initSyncDataTypeList;
        if (needDataList.length === 0) {
          success();
          return;
        }
        fetchLocalServicesStatus()
          .then(list => {
            const unavailableList = needDataList.filter(item => {
              // 过滤已完成初始化的类型
              return !list?.available_sync_data_type?.includes(item);
            });

            if (unavailableList.length === 0) {
              success();
            }
          })
          .catch(() => {
            reject(new LocalDataError('初始化查询本地状态失败，请联系管理员!'));
          })
          .finally(() => {
            if (latestInitStatusRef.current !== 'success' && latestInitStatusRef.current !== 'error') {
              checkCount.current++;

              // 超过6分钟则失败
              if (checkCount.current < 12 * 6) {
                checkTimer.current = setTimeout(checkStatusFn, 5000);
              } else {
                reject(new LocalDataError('初始化超时，请联系管理员!'));
              }
            }
          });
      };
      checkStatusFn();
    }).catch(e => {
      onLoadingError();

      return Promise.reject(e);
    });
  });

  const retry = useMemoizedFn(async (isInit = false) => {
    setInitSyncStatus('none');
    checkCount.current = 0;
    try {
      await restartLocalServices({
        syncDataTypeList: errorServiceList.current
      });
      errorServiceList.current = [];

      await initDataLoading();
    } catch (error) {
      const msg = `${isInit ? '初始化' : '重试'}失败，请重试或联系管理员处理！`;
      onLoadingError();
      message.error(msg);
      logError(
        {
          keyword: InitLocalDataErrorKey,
          error,
          message: msg,
          initDataType: initSyncDataTypeList,
          curSyncDataTypeList: initSuccessDataTypeList.current
        },
        true
      );
    }
  });

  useEffect(() => {
    console.log(!manual && isPortAvailable, '黑屏参数');
    if (!manual && isPortAvailable) {
      initDataLoading().catch(() => {
        retry(true);
      });
    }
  }, [initDataLoading, isPortAvailable, manual, retry]);

  return {
    // displayText,
    initDataLoading,
    initSyncStatus,
    initSyncProgress,
    retry
  };
};
