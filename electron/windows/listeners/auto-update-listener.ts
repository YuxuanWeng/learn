import { AutoUpdateEventEnum } from 'app/types/IPCEvents';
import { WindowCategory } from 'app/types/types';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { writeLayoutWindows } from 'app/utils/layouts';
import { IpcMainEvent, ipcMain } from 'electron';
import { CancellationToken, UpdateCheckResult, autoUpdater } from 'electron-updater';
import { OmsApplicationStatusEnum, omsApp } from '../../models/oms-application';
import { judgeSetWindowBoundsCache } from '../../utils/bounds-helper-v2';
import { delayHelper } from '../../utils/utools';
import { createLoginWindow, createRouterWindow } from '../app-windows';
import { WindowManager } from '../models/windows-manager';
import { postMessageAllWindow } from './broadcast-listener';
import { stopCheckUrlIsReachable } from './network-listener';

let updateInfo: UpdateCheckResult | null;

const autoUpdateLogs: string[] = [];

const getUpdateLogs = () => autoUpdateLogs.join('\n');

let cancellationToken: CancellationToken | undefined;

let lastProgressTimer: NodeJS.Timeout | undefined;

const DOWNLOAD_TIMEOUT = 2 * 60 * 1000;

const onUpdateError = () => {
  WindowManager.get(WindowName.UpdateDownload)?.getContent()?.send(AutoUpdateEventEnum.UpdateError);
};

const updateLastProgressTimer = () => {
  if (lastProgressTimer != null) {
    clearTimeout(lastProgressTimer);
    lastProgressTimer = undefined;
  }

  lastProgressTimer = setTimeout(() => {
    cancellationToken?.cancel();
    cancellationToken = undefined;
    onUpdateError();
  }, DOWNLOAD_TIMEOUT);
};

const checkUpdate = async (_: any, showError = false) => {
  (autoUpdater as any).checkForUpdatesPromise = null;

  try {
    updateInfo = await autoUpdater.checkForUpdates();
  } catch (e) {
    if (showError) {
      throw e;
    }
  }

  postMessageAllWindow(AutoUpdateEventEnum.RefreshUpdateInfo, JSON.stringify(updateInfo?.updateInfo));

  return updateInfo;
};

const getUpdateInfo = () => updateInfo;

const quitAndInstall = () => {
  autoUpdater.quitAndInstall();
  WindowManager.get(WindowName.UpdateDownload)?.close();
};

const downloadUpdate = () => {
  cancellationToken = new CancellationToken();
  updateLastProgressTimer();
  return autoUpdater.downloadUpdate(cancellationToken);
};

const onDownloadProgress = (progress: any) => {
  updateLastProgressTimer();

  WindowManager.get(WindowName.UpdateDownload)
    ?.getContent()
    ?.send(AutoUpdateEventEnum.DownloadUpdateProgress, progress);
};

const onUpdateDownloaded = () => {
  WindowManager.get(WindowName.UpdateDownload)?.getContent()?.send(AutoUpdateEventEnum.UpdateDownloaded);
};

const openUpdateDownload = async (_e: IpcMainEvent, skipConfirm = false) => {
  const oldWindows = WindowManager.getAll();
  if (WindowManager.get(WindowName.MainHome)?.isAlive()) {
    await writeLayoutWindows();
  }
  omsApp.setAppStatus(OmsApplicationStatusEnum.BeforeUpdate);
  // 主动保存一次位置缓存；
  const pipeItems: (() => Promise<any>)[] = [];
  for (const win of oldWindows) {
    const fn = (): Promise<any> => {
      judgeSetWindowBoundsCache(win);
      return Promise.resolve([]);
    };
    pipeItems.push(fn, () => delayHelper(120)());
  }
  await WindowManager.pipe(pipeItems);
  stopCheckUrlIsReachable();
  createRouterWindow({
    name: WindowName.UpdateDownload,
    category: WindowCategory.Basic,
    title: '自动更新',
    options: { width: 420, height: 210, resizable: false, skipTaskbar: false },
    custom: { route: CommonRoute.UpdateDownload, urlParams: `skipConfirm=${skipConfirm}` }
  });

  for (const win of oldWindows) win.close();
};

const abortUpdate = () => {
  if (WindowManager.get(WindowName.Login) == null) {
    createLoginWindow({}, false);

    WindowManager.get(WindowName.UpdateDownload)?.close();
  }
};

const start = () => {
  ipcMain.handle(AutoUpdateEventEnum.CheckUpdate, checkUpdate);
  ipcMain.handle(AutoUpdateEventEnum.GetUpdateInfo, getUpdateInfo);
  ipcMain.on(AutoUpdateEventEnum.QuitAndInstall, quitAndInstall);
  ipcMain.handle(AutoUpdateEventEnum.DownloadUpdate, downloadUpdate);
  ipcMain.handle(AutoUpdateEventEnum.GetUpdateLogs, getUpdateLogs);
  ipcMain.on(AutoUpdateEventEnum.OpenUpdateDownload, openUpdateDownload);
  ipcMain.on(AutoUpdateEventEnum.AbortUpdate, abortUpdate);
  autoUpdater.on('error', onUpdateError);
  autoUpdater.on('download-progress', onDownloadProgress);
  autoUpdater.on('update-downloaded', onUpdateDownloaded);
};

const end = () => {
  ipcMain.off(AutoUpdateEventEnum.CheckUpdate, checkUpdate);
  ipcMain.off(AutoUpdateEventEnum.GetUpdateInfo, getUpdateInfo);
  ipcMain.off(AutoUpdateEventEnum.QuitAndInstall, quitAndInstall);
  ipcMain.off(AutoUpdateEventEnum.DownloadUpdate, downloadUpdate);
  ipcMain.off(AutoUpdateEventEnum.GetUpdateLogs, getUpdateLogs);
  ipcMain.off(AutoUpdateEventEnum.OpenUpdateDownload, openUpdateDownload);
  ipcMain.off(AutoUpdateEventEnum.AbortUpdate, abortUpdate);
  autoUpdater.off('error', onUpdateError);
  autoUpdater.off('download-progress', onDownloadProgress);
  autoUpdater.off('update-downloaded', onUpdateDownloaded);
};

/**
 * 自动升级事件
 */
export default () => [start, end];
