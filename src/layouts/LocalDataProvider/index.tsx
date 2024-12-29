import { ReactNode, useEffect, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { IconAttentionFilled, IconLoading } from '@fepkg/icon-park-react';
import { SyncDataType } from '@fepkg/services/types/enum';
import InSyncSvg from '@/assets/image/in-sync.svg';
import { useInitLocalizationData } from '@/common/hooks/data-localization/useInitLocalizationData';
import { useMaximize } from '@/common/hooks/useMaximize';
import { LocalWebSocketProvider } from '@/common/providers/LocalWebSocket';
import { Action } from '@/components/AppBar/Action';
import { DataInitProgress } from '@/components/DataInitProgress';
import { DraggableHeader } from '@/components/HeaderBar';
import { SyncErrorModal } from '@/components/SyncErrorModal';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { LiveQueryMapObserverProvider } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { usePortAvailable } from '@/layouts/LocalDataProvider/hooks/usePortAvailable';
import { DialogLayout } from '../Dialog';

type ILocalDataProviderProps = {
  title?: string;
  initSyncDataTypeList?: SyncDataType[];
  children?: ReactNode;
  header?: ReactNode;
  close?: () => void;
};
const borderStyle = 'border border-solid border-gray-600 rounded-lg';
const titleStyle = 'ml-2 text-md font-bold text-gray-000';
const contentStyle = 'text-sm text-gray-200';

const LocalDataProviderInner = ({ title, initSyncDataTypeList, children, close, header }: ILocalDataProviderProps) => {
  const dialogLayout = useDialogLayout();
  const isDialog = dialogLayout != null;
  const [hintText, setHintText] = useState('基础数据开始增量更新...');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHintText('初始化界面...');
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const cancel =
    dialogLayout?.cancel ??
    (() => {
      window.Main.close();
    });
  const { isPortAvailable } = usePortAvailable();

  const { initSyncStatus, initSyncProgress, retry } = useInitLocalizationData({
    initSyncDataTypeList,
    isPortAvailable
  });

  const { toggleMaximize } = useMaximize();

  if (!initSyncDataTypeList) {
    if (!isPortAvailable) {
      return null;
    }
    return children;
  }

  if (initSyncStatus === 'success') {
    return (
      <>
        {children}
        <SyncErrorModal
          businessDataTypeList={initSyncDataTypeList}
          onConfirm={close}
        />
      </>
    );
  }

  return (
    <>
      {header ??
        (isDialog ? (
          <DialogLayout.Header
            controllers={['min', 'max', 'close']}
            onCancel={() => {
              // if (initSyncStatus === 'error') {
              //   retry();
              // }
              cancel();
            }}
          >
            <Dialog.Header>{title}</Dialog.Header>
          </DialogLayout.Header>
        ) : (
          <DraggableHeader onDoubleClick={toggleMaximize}>
            <div className="flex items-center bg-gray-800 h-12 w-full pl-3 border border-solid border-transparent border-b-gray-600">
              <div>{title}</div>
              <div className="flex-1" />
              <Action />
            </div>
          </DraggableHeader>
        ))}
      <div
        className={cx(
          'w-full h-full flex justify-center items-center bg-gray-700',
          initSyncStatus === 'none' && 'hidden'
        )}
      >
        <div className={cx(borderStyle, 'w-[800px] h-[420px] flex flex-col justify-between overflow-hidden')}>
          <div className="flex flex-col items-center">
            <img
              className="w-[160px] h-[160px] mt-[65px]"
              src={InSyncSvg}
              alt="数据同步"
            />
            <div className="mt-2 text-center">
              {initSyncStatus === 'error' ? (
                <>
                  <div>
                    <div className="w-4 h-4 bg-orange-600 rounded-full inline-flex items-center justify-center">
                      <IconAttentionFilled
                        className="text-orange-100"
                        size={12}
                        theme="filled"
                      />
                    </div>
                    <span className={titleStyle}>数据增量更新失败</span>
                  </div>
                  <div className={contentStyle}>请重试或联系管理员处理</div>
                  <Button
                    type="primary"
                    className="mt-2 w-18"
                    onClick={() => retry()}
                  >
                    重试
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <div className="w-4 h-4 bg-primary-600 rounded-full inline-flex items-center justify-center">
                      <IconLoading
                        className="animate-spin text-primary-100"
                        size={12}
                        theme="filled"
                      />
                    </div>

                    <span className={titleStyle}>{hintText}</span>
                  </div>
                  <div className={contentStyle}>请暂时不要关闭窗口</div>
                </>
              )}
            </div>
          </div>
          <DataInitProgress
            progress={initSyncProgress}
            status={initSyncStatus}
          />
        </div>
      </div>
    </>
  );
};

export const LocalDataProvider = (params: ILocalDataProviderProps) => {
  return (
    <LocalWebSocketProvider>
      <LiveQueryMapObserverProvider>
        <LocalDataProviderInner {...params} />
      </LiveQueryMapObserverProvider>
    </LocalWebSocketProvider>
  );
};
