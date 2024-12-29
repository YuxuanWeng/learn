// 用于关闭loading页面的兜底
import { ipcMain } from 'electron';
import { LoadingEventEnum } from '../../types/IPCEvents';
import { WindowName } from '../../types/window-v2';
import { WindowManager } from '../models/windows-manager';

let shouldClose = false;

export const setShouldCloseLoading = (val: boolean) => {
  shouldClose = val;
};

const getShouldCloseLoading = () => {
  return WindowManager.getAll().some(i => {
    return shouldClose || (i.name !== WindowName.LoadingWindow && i.name !== WindowName.Login);
  });
};

const start = () => {
  ipcMain.handle(LoadingEventEnum.getShouldCloseLoading, getShouldCloseLoading);
};

const end = () => {
  ipcMain.off(LoadingEventEnum.getShouldCloseLoading, getShouldCloseLoading);
};

/**
 * util事件
 */
export default () => [start, end];
