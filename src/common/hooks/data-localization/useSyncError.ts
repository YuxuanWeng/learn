import { useEffect, useRef } from 'react';
import { SyncDataType } from '@fepkg/services/types/enum';
import { DataCheckSyncEventMessage } from 'app/packages/event-client/types';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { useAtom } from 'jotai';
import { GLOBAL_SCOPE, isConnectionLossAtom, isSyncErrorAtom } from '@/common/atoms';

// 若主面板出现数据同步失败后则需要重新登录
export const SyncErrorMessageForMain = '系统数据同步失败，请重新登录后使用！';
export const SyncErrorMessage = '数据同步失效，请关闭窗口！';
export const SyncWarningMessage = '数据同步异常，正在尝试恢复...';

/**
 * @param syncDataTypeList 入参为此处需要监听的类型，但基础类型错误则同步失败
 * 基础数据异常不报错，需要通过业务逻辑手动切换兜底api
 */
export default function useSyncError(syncDataTypeList: SyncDataType[]) {
  const [isSyncError, setIsSyncError] = useAtom(isSyncErrorAtom, GLOBAL_SCOPE); // 同步失败，数据不可用
  const [isConnectionLoss, setConnectionLoss] = useAtom(isConnectionLossAtom, GLOBAL_SCOPE); // 连接中断，数据不可信
  const connectionLossList = useRef<SyncDataType[]>([]);
  const syncErrorList = useRef<SyncDataType[]>([]);

  // 监听ws数据同步状态
  useEffect(() => {
    const realtimeSyncOff = window.UtilityProcess?.on<DataCheckSyncEventMessage>(
      DataLocalizationAction.RealtimeSyncStateChange,
      ctx => {
        const { status, syncDataType, message: msg } = ctx?.value ?? {};
        if (syncDataType !== undefined && syncDataTypeList.includes(syncDataType)) {
          switch (status) {
            case 'success': // 数据同步成功或恢复
              connectionLossList.current = connectionLossList.current.filter(type => type !== syncDataType);
              if (connectionLossList.current.length === 0) {
                setConnectionLoss(false);
                // message.success(msg);
              }
              break;
            case 'warning': // 网络中断，数据暂时不可用，但存在恢复的可能
              connectionLossList.current.push(syncDataType);
              // message.error(msg);
              setConnectionLoss(true);
              break;
            case 'error': // 发生致命错误，数据不可用，不存在恢复的可能
              syncErrorList.current.push(syncDataType);
              // message.error(msg);
              setIsSyncError(true);
              break;
            default:
              break;
          }
        }
      }
    );
    return () => {
      realtimeSyncOff();
    };
  }, []);

  return {
    isConnectionLoss,
    isSyncError
  };
}
