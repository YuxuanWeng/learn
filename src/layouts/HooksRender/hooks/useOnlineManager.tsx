import { useEffect, useLayoutEffect } from 'react';
import cx from 'classnames';
import { Portal } from '@fepkg/components/Portal';
import { useMemoizedFn } from 'ahooks';
import { NetworkEventEnum } from 'app/types/IPCEvents';
import {
  useIsConnectionLoss,
  useIsSyncError,
  useOfflineTipVisible,
  useSetIsOnline,
  useSetOfflineTipVisible
} from '@/common/atoms';
import { SyncErrorMessage, SyncWarningMessage } from '@/common/hooks/data-localization/useSyncError';
import { trackSpecialSlow } from '@/common/utils/logger/special';

export const useOnlineManager = () => {
  const setIsOnline = useSetIsOnline();
  const setOfflineTipVisible = useSetOfflineTipVisible();

  const handleIsOnlineChange = useMemoizedFn((isReachable: boolean | undefined) => {
    setIsOnline(prev => {
      if (prev !== isReachable) {
        return !!isReachable;
      }
      return prev;
    });
  });

  const handleOfflineTipVisibleChange = useMemoizedFn((offlineTipVisible: boolean | undefined) => {
    setOfflineTipVisible(prev => {
      if (prev !== offlineTipVisible) return !!offlineTipVisible;
      return prev;
    });
  });

  useLayoutEffect(() => {
    const { on } = window.Main;

    const offIsReachable = on(NetworkEventEnum.NetworkUrlIsReachable, handleIsOnlineChange);
    const offVisibleChange = on(NetworkEventEnum.OfflineTipVisibleChange, handleOfflineTipVisibleChange);
    return () => {
      offIsReachable();
      offVisibleChange();
    };
  }, [handleIsOnlineChange, handleOfflineTipVisibleChange]);
};

export const OfflineTip = () => {
  const offlineTipVisible = useOfflineTipVisible();
  const isSyncError = useIsSyncError();
  const isConnectionLoss = useIsConnectionLoss();

  useEffect(() => {
    if (offlineTipVisible) trackSpecialSlow('ping-failure');
  }, [offlineTipVisible]);

  return (
    <Portal rootId="offline-tip">
      {offlineTipVisible || isSyncError || isConnectionLoss ? (
        <div className={cx('fixed left-0 right-0 bottom-0 z-hightest flex-center h-6 bg-danger-500')}>
          <div className="flex gap-3 flex-center">
            <i className="icon-state_3 w-3 h-3" />
            {offlineTipVisible && <span className="text-xs font-semibold">当前网络异常，请检查你的网络设置！</span>}
            <span className="text-xs font-semibold">
              {isConnectionLoss && !isSyncError && SyncWarningMessage}
              {isSyncError && SyncErrorMessage}
            </span>
          </div>
        </div>
      ) : null}
    </Portal>
  );
};
