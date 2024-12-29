import IPCEventEnum from 'app/types/IPCEvents';
import { getOnTopLevel } from 'app/utils/args';
import { WindowInstance } from '../../types/window-type';
import { WindowManager } from '../models/windows-manager';

let currentLockWindow: WindowInstance | null = null;

export const getCurrentLockWindow = () => currentLockWindow;
export const setCurrentLockWindow = (win: WindowInstance | null) => {
  currentLockWindow = win;
};

/**
 * 设置全局模态窗口行为
 */
const setDialogParentEnabled = (win: WindowInstance, parentContentsId: number, enabled: boolean) => {
  const parent = WindowManager.getByContentsId(parentContentsId);
  if (parent?.object == null || win?.object == null) return;
  if (enabled && parent.object.isAlwaysOnTop() && !win.object.isAlwaysOnTop()) win.object.setAlwaysOnTop(true);
  parent.getContent()?.postMessage(IPCEventEnum.SetWindowIsEnable, enabled);
  parent.object.setFocusable(enabled);
};

/**
 * 设置锁定窗口相关的启用态
 * @param win 当前窗口
 * @param enabled 其他窗口是否启用
 */
export const setDialogEnabled = (win: WindowInstance, isLock: boolean, enabled: boolean) => {
  const allWindows = WindowManager.getWindows();
  allWindows.forEach(item => {
    if (!item?.isAlive() || item.getContent()?.id === win.getContent()?.id) return;
    item?.getContent()?.postMessage(IPCEventEnum.SetWindowIsEnable, enabled);
    item?.object?.setAlwaysOnTop(!!item.custom.isTop && enabled, getOnTopLevel());
  });
  win.object?.setAlwaysOnTop(isLock || !!win.custom.isTop, getOnTopLevel());
};

/** 退出当前窗口的锁定态 */
export const cancelSelfWindowLock = (win: WindowInstance) => {
  if (win.unlocked) return;
  win.unlocked = true;
  setDialogEnabled(win, false, true);
  setCurrentLockWindow(null);
};

/** 设置当前窗口为全局锁定 */
export const lockDialog = (win: WindowInstance) => {
  setDialogEnabled(win, true, false);
  setCurrentLockWindow(win);
  win.object?.moveTop();
  win.object?.once('close', () => {
    if (!win.unlocked) cancelSelfWindowLock(win);
  });
};

export const modalDialog = (win: WindowInstance, parentContentsId: number) => {
  setDialogParentEnabled(win, parentContentsId, false);
  setCurrentLockWindow(win);
  win.object?.once('close', () => {
    setDialogParentEnabled(win, parentContentsId, true);
    setCurrentLockWindow(null);
  });
};
