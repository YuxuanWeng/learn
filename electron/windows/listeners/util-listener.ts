import { LogEventEnum, UtilEventEnum } from 'app/types/IPCEvents';
import { getStoredBounds } from 'app/utils/bounds-helper-v2';
import { LAYOUT_VERSION } from 'app/utils/layouts';
import { printLog, printWindowReady } from 'app/utils/print-log';
import { userInitConfigStorage } from 'app/windows/store/user-init-config-storage';
import { windowOpenedStorage } from 'app/windows/store/window-opened-storage';
import { IpcMainEvent, IpcMainInvokeEvent, app, clipboard, ipcMain, shell } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { omsApp } from '../../models/oms-application';
import { isMac } from '../../utils/utools';
import { WindowManager } from '../models/windows-manager';

/** 唤醒当前窗口(最小化时恢复并获取焦点) */
const focusOnSelf = (_e: IpcMainEvent) => {
  const win = WindowManager.getByContentsId(_e.sender.id);
  if (win?.name) {
    WindowManager.focus(win.name);
  }
};

/** 唤醒指定窗口(最小化时恢复并获取焦点) */
const focusByWindowName = (_event: IpcMainInvokeEvent, name: string) => {
  const allWindows = WindowManager.getWindows();
  const window = allWindows.find(win => win?.isAlive() && win?.name === name);
  if (window) {
    WindowManager.focus(window.name);
  }
};

const openExternal = (_e: IpcMainInvokeEvent, url: string) => {
  shell.openExternal(url);
};

const copy = (_e: IpcMainInvokeEvent, text: string) => {
  clipboard.writeText(text);
};

// 应用单次生命周期的唯一标识
export const softLifecycleId = uuidv4();

const getSoftLifecycleId = () => softLifecycleId;

let currentDeviceId = '';

export const setDeviceId = (id: string) => {
  currentDeviceId = id;
};

export const getDeviceId = () => {
  return currentDeviceId;
};

const getAppPath = (
  _e: IpcMainInvokeEvent,
  name:
    | 'home'
    | 'appData'
    | 'userData'
    | 'sessionData'
    | 'temp'
    | 'exe'
    | 'module'
    | 'desktop'
    | 'documents'
    | 'downloads'
    | 'music'
    | 'pictures'
    | 'videos'
    | 'recent'
    | 'logs'
    | 'crashDumps'
) => {
  return app.getPath(name);
};

/**
 * 获取指定name的窗口是否存在
 * */
const getWindowIsExist = (_event: IpcMainInvokeEvent, name: string) => {
  if (!name) return false;
  const allWindows = WindowManager.getWindows();
  return allWindows.some(win => win?.isAlive() && win?.name === name);
};

const sendLogToMainLog = (_event: IpcMainInvokeEvent, ...args: unknown[]) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  printLog(`来自 ${win?.name}, msg: --`, ...args);
};

const getAllWindows = () =>
  WindowManager.getWindows().map(win => {
    return {
      name: win.name,
      bounds: win.getBounds(),
      isMax: win.isMaximized()
    };
  });

const getCachedWindows = () => {
  const keys = windowOpenedStorage.getKeys();
  const allLayout = keys.map(key => windowOpenedStorage.get(key));
  const userConfig = userInitConfigStorage.getUserInitConfig();
  const userId = userConfig?.userInfo?.user_id;

  const layout = allLayout.filter(item => item.userId === userId && item.version === LAYOUT_VERSION);
  return layout.map(item => {
    const cacheBounds = getStoredBounds(item.name);
    return {
      name: item.name,
      bounds: {
        x: cacheBounds?.x,
        y: cacheBounds?.y,
        width: cacheBounds?.width,
        height: cacheBounds?.height,
        isMax: cacheBounds?.isMaximized
      }
    };
  });
};

const autoLaunch = (_e: IpcMainInvokeEvent, openAtLogin: boolean) => {
  if (isMac) {
    app.setLoginItemSettings({
      openAtLogin,
      openAsHidden: false // mac专属属性
    });
  } else {
    // Windows删除老版本重复启动项
    app.setLoginItemSettings({
      openAtLogin: false,
      name: 'electron.app.OMS UAT'
    });

    app.setLoginItemSettings({
      openAtLogin,
      name: 'electron.app.OMS' // Windows专属属性，需要指定name，防止注册表出现重复启动项
    });
  }
};

const getAppConfig = () => omsApp.appConfig;

const start = () => {
  ipcMain.on(UtilEventEnum.FocusOnSelf, focusOnSelf);
  ipcMain.handle(UtilEventEnum.FocusByWindowName, focusByWindowName);
  ipcMain.handle(UtilEventEnum.OpenExternal, openExternal);
  ipcMain.on(UtilEventEnum.Copy, copy);
  ipcMain.on(UtilEventEnum.AutoLaunch, autoLaunch);
  ipcMain.handle(UtilEventEnum.GetAppConfig, getAppConfig);
  ipcMain.handle(UtilEventEnum.GetSoftLifecycleId, getSoftLifecycleId);
  ipcMain.handle(UtilEventEnum.GetDeviceId, getDeviceId);
  ipcMain.handle(UtilEventEnum.GetAppPath, getAppPath);
  ipcMain.handle(UtilEventEnum.GetWindowIsExist, getWindowIsExist);
  ipcMain.handle(LogEventEnum.PrintWindowReady, printWindowReady);
  ipcMain.handle(LogEventEnum.SendLogToMainLog, sendLogToMainLog);
  ipcMain.handle(UtilEventEnum.GetAllWindows, getAllWindows);
  ipcMain.handle(UtilEventEnum.GetCachedWindows, getCachedWindows);
};

const end = () => {
  ipcMain.off(UtilEventEnum.FocusOnSelf, focusOnSelf);
  ipcMain.off(UtilEventEnum.FocusByWindowName, focusByWindowName);
  ipcMain.off(UtilEventEnum.OpenExternal, openExternal);
  ipcMain.off(UtilEventEnum.Copy, copy);
  ipcMain.off(UtilEventEnum.AutoLaunch, autoLaunch);
  ipcMain.off(UtilEventEnum.GetAppConfig, getAppConfig);
  ipcMain.off(UtilEventEnum.GetSoftLifecycleId, getSoftLifecycleId);
  ipcMain.off(UtilEventEnum.GetDeviceId, getDeviceId);
  ipcMain.off(UtilEventEnum.GetAppPath, getAppPath);
  ipcMain.off(UtilEventEnum.GetWindowIsExist, getWindowIsExist);
  ipcMain.off(LogEventEnum.PrintWindowReady, printWindowReady);
  ipcMain.off(LogEventEnum.SendLogToMainLog, sendLogToMainLog);
  ipcMain.off(UtilEventEnum.GetAllWindows, getAllWindows);
  ipcMain.off(UtilEventEnum.GetCachedWindows, getCachedWindows);
};

/**
 * util事件
 */
export default () => [start, end];
