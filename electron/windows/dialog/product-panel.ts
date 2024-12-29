import { DialogEvent } from 'app/types/IPCEvents';
import { WindowInstance } from 'app/types/window-type';
import { WindowName } from 'app/types/window-v2';
import { windowOpenedStorage } from 'app/windows/store/window-opened-storage';
import { WindowManager } from '../models/windows-manager';

/**
 * 获取当前所有已打开的行情看板页面
 * @param excludes string 排除
 */
export const getAllOpenedProductPanelGroupIds = (excludes?: string) => {
  const res: string[] = [];
  const allWindow = WindowManager.getAll();
  allWindow.forEach(win => {
    const groupId = win.custom.routePathParams?.[1] ?? '';
    if (groupId && groupId !== excludes && win.name.startsWith(WindowName.ProductPanel)) {
      res.push(groupId);
    }
  });
  return res;
};

/**
 * 获取当前缓存的行情看板页信息
 */
export const getAllCachedProductPanelGroupIds = () => {
  try {
    const keys = windowOpenedStorage.getKeys();
    const layout = keys.map(key => windowOpenedStorage.get(key));
    return layout
      .filter(item => item.name.startsWith(WindowName.ProductPanel))
      .map(item => item.custom.routePathParams?.[1])
      .filter(Boolean);
  } catch (e) {
    return [];
  }
};

/** 行情看板窗口信息发生变更 */
export const sendProductPanelChange = (excludes?: string) => {
  const openedGroupIds = getAllOpenedProductPanelGroupIds(excludes);
  WindowManager.get(WindowName.MainHome)?.getContent()?.postMessage(DialogEvent.ProductPanelChange, openedGroupIds);
};

export const beforeCloseProductPanel = (win: WindowInstance) => {
  if (!win.name.startsWith(WindowName.ProductPanel)) return;
  const groupId = win.custom.routePathParams?.[1] ?? '';
  if (!groupId) return;
  sendProductPanelChange(groupId);
};
