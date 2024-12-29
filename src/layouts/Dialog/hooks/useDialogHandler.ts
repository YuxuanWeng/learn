import { useMemoizedFn } from 'ahooks';
import { DialogEvent } from 'app/types/IPCEvents';
import { DialogChannelAction, DialogHandlerConfig } from 'app/types/dialog-v2';
import { useAtomValue } from 'jotai';
import { useParentPort, useSetParentPort } from '@/common/atoms';
import { isProd } from '@/common/utils';
import { autoCloseAtom } from '@/components/AlwaysOpenToolView';

export const useDialogHandler = () => {
  const { post } = useParentPort();
  const setParentPort = useSetParentPort();

  const autoCloseAtomValue = useAtomValue(autoCloseAtom);

  const handler =
    (type: DialogEvent) =>
    <T>(data?: T, config: DialogHandlerConfig = { isCloseModal: true }) => {
      requestIdleCallback(() => {
        /*
         常开按钮调试工具，用于阻止窗口的提交，更方便的查看网络请求
         需满足三个条件：1.test或dev环境; 2.动作为confirm; 3.常开按钮状态为'常开'（默认是关闭）
         */
        if (!isProd() && type === DialogEvent.Confirm && !autoCloseAtomValue) {
          return;
        }
        // 告诉 parent channel 需要关闭
        post({ action: DialogChannelAction.Close });
        // 释放渲染进程内的 parent channel
        setParentPort(null);

        const { sendMessage } = window.Main;
        sendMessage(type, { data, config });
      });
    };

  const handleDialogConfirm = useMemoizedFn(handler(DialogEvent.Confirm));
  const handleDialogCancel = useMemoizedFn(handler(DialogEvent.Cancel));

  return { handleDialogConfirm, handleDialogCancel };
};
