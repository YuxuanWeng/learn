import { ReactNode, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { Button } from '@fepkg/components/Button';
import { Dialog } from '@fepkg/components/Dialog';
import { Modal } from '@fepkg/components/Modal';
import { IconAttentionFilled, IconLoading } from '@fepkg/icon-park-react';
import InSyncSvg from '@/assets/image/in-sync.svg';
import { useMemoizedFn } from 'ahooks';
import { useIsOnline } from '@/common/atoms';
import { SyncErrorMessage, SyncWarningMessage } from '@/common/hooks/data-localization/useSyncError';
import { useMaximize } from '@/common/hooks/useMaximize';
import { LocalWebSocketProvider, useLocalWebSocket } from '@/common/providers/LocalWebSocket';
import { Action } from '@/components/AppBar/Action';
import { DataInitProgress } from '@/components/DataInitProgress';
import { DraggableHeader } from '@/components/HeaderBar';
import { useDialogLayout } from '@/layouts/Dialog/hooks';
import { LiveQueryMapObserverProvider } from '@/layouts/LocalDataProvider/hooks/useLiveQueryObserverMap';
import { DialogLayout } from '../Dialog';

type ILocalDataProviderProps = {
  title?: string;
  children?: ReactNode;
  header?: ReactNode;
  close?: () => void;
};
const borderStyle = 'border border-solid border-gray-600 rounded-lg';
const titleStyle = 'ml-2 text-md font-bold text-gray-000';
const contentStyle = 'text-sm text-gray-200';

const LocalServerLoadingInner = ({ title, children, close, header }: ILocalDataProviderProps) => {
  const dialogLayout = useDialogLayout();
  const { dataReady, netReady, succeeded, connectFailed, retry: localServerRetry } = useLocalWebSocket();

  const isDialog = dialogLayout != null;
  const [hintText, setHintText] = useState('基础数据开始增量更新...');
  const [localServerProgress, setLocalServerProgress] = useState(0);
  const processTimer = useRef<NodeJS.Timeout>();
  const hintTextTimer = useRef<NodeJS.Timeout>();
  const { toggleMaximize } = useMaximize();
  const isOnline = useIsOnline();

  const dataSyncError = !dataReady || !netReady;

  const reStartTimer = useMemoizedFn(() => {
    hintTextTimer.current = setTimeout(() => {
      setHintText('初始化界面...');
      clearTimeout(hintTextTimer.current);
    }, 2000);
    processTimer.current = setInterval(() => {
      setLocalServerProgress(value => {
        if (value < 98) {
          return value + 0.1;
        }
        clearInterval(processTimer.current);
        return value;
      });
    }, 100);
  });

  useEffect(() => {
    if (title) {
      reStartTimer();
    }
  }, []);

  useEffect(() => {
    if (connectFailed || succeeded) {
      clearInterval(processTimer.current);
    }
  }, [connectFailed, succeeded]);

  if (!title) {
    return children;
  }

  const cancel =
    dialogLayout?.cancel ??
    (() => {
      window.Main.close();
    });

  const reStart = () => {
    setLocalServerProgress(0);
    reStartTimer();
    if (connectFailed) {
      localServerRetry();
    }
  };

  if (succeeded) {
    return (
      <>
        {children}
        <Modal
          visible={dataSyncError}
          title="数据同步错误"
          confirmByEnter
          closable={false}
          onConfirm={close}
          footerProps={{
            cancelBtnProps: {
              style: { display: 'none' }
            },
            confirmBtnProps: {
              label: '关闭窗口'
            }
          }}
        >
          <div className="pt-4 pb-4 pl-6 pr-6">{isOnline || dataSyncError ? SyncErrorMessage : SyncWarningMessage}</div>
        </Modal>
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
              cancel();
            }}
          >
            <Dialog.Header>{title}</Dialog.Header>
          </DialogLayout.Header>
        ) : (
          <DraggableHeader onDoubleClick={toggleMaximize}>
            <div className="flex items-center bg-gray-800 h-14 w-full pl-4 border border-solid border-transparent border-b-gray-600">
              <div>{title}</div>
              <div className="flex-1" />
              <Action />
            </div>
          </DraggableHeader>
        ))}
      <div className="w-full h-full flex justify-center items-center bg-gray-700">
        <div className={cx(borderStyle, 'w-[800px] h-[420px] flex flex-col justify-between overflow-hidden')}>
          <div className="flex flex-col items-center">
            <img
              className="w-[160px] h-[160px] mt-[65px]"
              src={InSyncSvg}
              alt="数据同步"
            />
            <div className="mt-2 text-center">
              {connectFailed ? (
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
                    onClick={reStart}
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
            progress={localServerProgress}
            status={connectFailed ? 'error' : 'loading'}
          />
        </div>
      </div>
    </>
  );
};

export const LocalServerLoadingProvider = (params: ILocalDataProviderProps) => {
  return (
    <LiveQueryMapObserverProvider>
      <LocalWebSocketProvider>
        <LocalServerLoadingInner {...params} />
      </LocalWebSocketProvider>
    </LiveQueryMapObserverProvider>
  );
};
