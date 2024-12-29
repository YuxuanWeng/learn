import React, { useEffect } from 'react';
import { ModalUtils } from '@fepkg/components/Modal';
import { SyncDataType } from '@fepkg/services/types/enum';
import { useMemoizedFn } from 'ahooks';
import useSyncError, { SyncErrorMessage, SyncWarningMessage } from '@/common/hooks/data-localization/useSyncError';

interface SyncErrorModelProps {
  businessDataTypeList: SyncDataType[];
  onConfirm?: () => void;
}

export const SyncErrorModal: React.FC<SyncErrorModelProps> = ({ businessDataTypeList, onConfirm }) => {
  const { isConnectionLoss, isSyncError } = useSyncError(businessDataTypeList);
  // const layout = useLogout();
  const handleConfirm = useMemoizedFn(() => {
    onConfirm?.();

    // if (errorLevel === 'error') {
    //   layout();
    // }
  });

  useEffect(() => {
    if (isSyncError || isConnectionLoss) {
      ModalUtils.warning({
        width: 360,
        title: '数据同步错误',
        content: isSyncError ? SyncErrorMessage : SyncWarningMessage,
        onOk: handleConfirm,
        okText: '关闭窗口',
        cancelButtonProps: {
          hidden: true
        },
        blockAll: true
      });
    }
  }, [handleConfirm, isConnectionLoss, isSyncError]);

  return null;
};
