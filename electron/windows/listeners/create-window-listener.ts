import IPCEventEnum from 'app/types/IPCEvents';
import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';
import { afterWindowClose, beforeWindowClose } from '../app-windows';
import { createDialogWindow } from '../dialog/dialog';
import { CreateDialogParams } from '../models/base';
import { NormalWindow } from '../models/normal-window';
import { WindowLifeCycleEnum } from '../models/type';
import { WindowManager } from '../models/windows-manager';

const getWindowName = (_event: IpcMainInvokeEvent) => {
  const contentId = _event.sender.id;
  const win = WindowManager.getByContentsId(contentId);
  if (win?.name && WindowManager.isInPool(win?.name)) return '';
  return win?.name;
};

const triggerWindowFocus = (_event: IpcMainInvokeEvent) => {
  const contentId = _event.sender.id;
  return WindowManager.getByContentsId(contentId)?.focus();
};

/**
 * 创建 electron 弹窗
 * @param _event ipcRenderer默认事件对象
 * @param params 参数，DialogTypes | DialogWindowConfig
 * @returns 异步回调
 */
const createDialogRouterWindow = async (_event: IpcMainInvokeEvent, params: Omit<CreateDialogParams, 'category'>) => {
  return createDialogWindow({ ...params, parentId: _event.sender.id });
};

const didNavigateInPage = (_event: IpcMainEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (win) win.getContent()?.postMessage(IPCEventEnum.AfterWindowReadyToShow, true);
};

/** 退出应用，关闭所有窗口 */
const quitSystem = () => {
  const allWindow = WindowManager.getAll();
  allWindow.forEach(win => {
    if (win?.isAlive()) {
      beforeWindowClose(win);
      afterWindowClose(win);
      win.close();
    }
  });
};

const normalRouteWindowReady = (_event: IpcMainEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id) as NormalWindow;
  if (!win) return;
  win.normalRouteIsReady = true;
  win.setStatus(WindowLifeCycleEnum.Ready);
};

const start = () => {
  ipcMain.handle(IPCEventEnum.GetWindowName, getWindowName);
  ipcMain.handle(IPCEventEnum.TriggerWindowFocus, triggerWindowFocus);
  ipcMain.handle(IPCEventEnum.CreateDialogWindow, createDialogRouterWindow);
  ipcMain.on(IPCEventEnum.ResizeWindow, (_event: IpcMainEvent, width: number, height: number) => {
    const win = BrowserWindow.fromWebContents(_event.sender);
    win?.setSize(width, height);
  });
  ipcMain.on(IPCEventEnum.DidNavigateInPage, didNavigateInPage);
  ipcMain.on(IPCEventEnum.QuitSystem, quitSystem);
  ipcMain.on(IPCEventEnum.NormalRouteWindowReady, normalRouteWindowReady);
};

const end = () => {
  ipcMain.off(IPCEventEnum.GetWindowName, getWindowName);
  ipcMain.off(IPCEventEnum.CreateDialogWindow, createDialogRouterWindow);
  ipcMain.off(IPCEventEnum.DidNavigateInPage, didNavigateInPage);
  ipcMain.off(IPCEventEnum.QuitSystem, quitSystem);
  ipcMain.off(IPCEventEnum.NormalRouteWindowReady, normalRouteWindowReady);
};

/**
 * 渲染进程创建窗体
 */
export default () => [start, end];
