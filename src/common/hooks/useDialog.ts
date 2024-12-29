import { useRef } from 'react';
import { message } from '@fepkg/components/Message';
import { useMemoizedFn } from 'ahooks';
import { DialogResponseType } from 'app/types/dialog-v2';
import { CreateDialogParams } from 'app/windows/models/base';
import useOnlineOpenDialog from './useOnlineOpenDialog';

type Options<R, E> = {
  showOfflineMsg?: boolean;
  onSuccess?: (data: R) => void;
  onCancel?: (data: E) => void;
  onError?: (data: E) => void;
};

const MAX_INTERVAL = 120;

export const useDialogWindow = () => {
  const { openDialogWindow } = window.Dialog;
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();

  const lastOpenTime = useRef<number>(0);

  const openDialog = useMemoizedFn(
    async <R, E>(param: Omit<CreateDialogParams, 'category'>, options?: Options<R, E>) => {
      /** 断网检测 */
      if (options?.showOfflineMsg !== false && !beforeOpenDialogWindow()) {
        options?.onError?.('无网络' as unknown as E);
        return false;
      }

      /** 防止重复点击 */
      const now = Date.now();
      if (now - lastOpenTime.current <= MAX_INTERVAL) {
        options?.onError?.('不可重复点击' as unknown as E);
        return false;
      }
      lastOpenTime.current = now;

      try {
        const response = await openDialogWindow(param);
        if (response.type === DialogResponseType.Success) options?.onSuccess?.(response.data as R);
        if (response.type === DialogResponseType.Cancel) options?.onCancel?.(response.data as E);
        if (response.type === DialogResponseType.Error) {
          options?.onError?.(response.data as E);
          if (param.numberLimit && response.data) {
            message.error(String(response.data));
          }
        }
        return true;
      } catch (err) {
        options?.onError?.('创建失败' as unknown as E);
        console.log('窗口创建失败: ', err);
        return false;
      }
    }
  );

  return { openDialog };
};
