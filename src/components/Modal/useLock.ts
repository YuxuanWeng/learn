import { useEffect } from 'react';
import IPCEventEnum from 'app/types/IPCEvents';

export const useLock = (visible?: boolean, lock?: boolean) => {
  useEffect(() => {
    const control = !(!lock || visible == void 0);

    if (control) {
      if (visible === true) window.Main?.sendMessage(IPCEventEnum.LockCurrentWindow);
      else window.Main?.sendMessage(IPCEventEnum.UnLockCurrentWindow);
    }
    return () => {
      if (lock && visible) window.Main?.sendMessage(IPCEventEnum.UnLockCurrentWindow);
    };
  }, [lock, visible]);
};
