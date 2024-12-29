import { useLayoutEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';
import IPCEventEnum, { LoginEventEnum } from 'app/types/IPCEvents';
import { WindowName } from 'app/types/window-v2';
import { isAutoLogoutEnabled } from '../ab-rules';
import { exitToLogin } from '../utils/login';

const { on, remove } = window.Main;

// TODO: 如果使用快捷键（比如command+Q），会导致不能执行到这里的回调，需优化全局快捷键；
/**
 * 在 Window 安全关闭之前执行的 Effect
 * @param callback 回调函数
 * @param firstHomeCallback 首页关闭前回调
 */
export const useBeforeWindowSafelyClosedEffect = (callback?: () => void, firstHomeCallback?: () => void) => {
  /** 是否需要崩溃后重新启动程序 */
  const needRestartByCrashed = useRef(false);
  const isAutoLogout = useRef(false);

  const handleBeforeWindowClose = useMemoizedFn(async () => {
    if (needRestartByCrashed.current || isAutoLogout.current) return false;
    const winName = await window.Main.invoke(IPCEventEnum.GetWindowName, []);
    if (winName === WindowName.MainHome) {
      firstHomeCallback?.();
    }
    callback?.();
    return true;
  });

  useLayoutEffect(() => {
    on(IPCEventEnum.BeforeAppRestartByCrash, () => {
      needRestartByCrashed.current = true;
    });
    on(LoginEventEnum.AutoLogout, async () => {
      if (isAutoLogoutEnabled()) {
        await handleBeforeWindowClose();
        isAutoLogout.current = true;
        exitToLogin();
      }
    });
    on(IPCEventEnum.BeforeWindowClose, () => handleBeforeWindowClose());
    return () => {
      remove(IPCEventEnum.BeforeWindowClose);
      remove(LoginEventEnum.AutoLogout);
      remove(IPCEventEnum.BeforeAppRestartByCrash);
    };
  }, [handleBeforeWindowClose]);
};
