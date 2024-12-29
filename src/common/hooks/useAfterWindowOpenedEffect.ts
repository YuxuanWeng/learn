import { useCallback, useLayoutEffect } from 'react';
import IPCEventEnum from 'app/types/IPCEvents';
import { useChildPortCache } from '@/common/atoms';

const { on, remove } = window.Main;

/**
 * 在 Window 打开时执行的 Effect
 * @param callback 回调函数
 */
export const useAfterWindowOpenedEffect = (callback?: () => void) => {
  const childPortCache = useChildPortCache();

  const handleAfterWindowReadyToShow = useCallback(() => {
    callback?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childPortCache, callback]);

  useLayoutEffect(() => {
    on(IPCEventEnum.AfterWindowReadyToShow, () => handleAfterWindowReadyToShow());
    return () => remove(IPCEventEnum.AfterWindowReadyToShow);
  }, [handleAfterWindowReadyToShow]);
};
