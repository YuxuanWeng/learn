import IPCEventEnum, { DialogEvent } from 'app/types/IPCEvents';
import { DialogHandlerParams, DialogResponseType } from 'app/types/dialog-v2';
import { getOnTopLevel } from 'app/utils/args';
import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, ipcMain } from 'electron';
import { afterWindowClose, beforeWindowClose } from '../app-windows';
import { getDialogCache } from '../dialog/context';
import { cancelSelfWindowLock, getCurrentLockWindow, lockDialog } from '../dialog/lock';
import { resendChildContextData } from '../dialog/message-channel';
import { getAllCachedProductPanelGroupIds } from '../dialog/product-panel';
import { WindowManager } from '../models/windows-manager';

const closeWindow = (_event: IpcMainEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (win != null) {
    win.object?.hide();
    win.close();
  } else {
    BrowserWindow.fromWebContents(_event.sender)?.close();
  }
};

/** 关闭窗口 */
export const beforeDialogClose = (_event: IpcMainEvent, type: DialogResponseType, params?: DialogHandlerParams) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  const winCache = getDialogCache(_event.sender.id);

  if (winCache && typeof winCache.resolve === 'function') {
    winCache.resolve({ type, data: params?.data });
  }
  if (!params?.config?.isCloseModal) return;

  if (win && !!win.custom?.isLock) cancelSelfWindowLock(win);

  if (win?.isAlive() && win?.name && win.isSpecial()) {
    /**
     * 为了保证特殊窗口（报价）的初次和后续打开速度，需特殊处理：
     * 1、初始状态：paintWhenInitiallyHidden: false
     * 2、自己控制show、hide，和关闭窗口的before、after等操作
     * 3、hide前动态设置 backgroundThrottling：setBackgroundThrottling(false)
     */
    if (win?.getContent()?.getBackgroundThrottling()) {
      win?.getContent()?.setBackgroundThrottling(false);
    }
    win?.object?.hide();
    beforeWindowClose(win);
    afterWindowClose(win);
    WindowManager.focusParentWindow(winCache?.parentId);
  } else closeWindow(_event);
};

const closeByName = (_e: IpcMainInvokeEvent, name: string) => {
  const win = WindowManager.get(name);
  win?.object?.close();
};

const dialogSuccess = (_event: IpcMainEvent, params?: DialogHandlerParams) => {
  beforeDialogClose(_event, DialogResponseType.Success, params);
};

const dialogCancel = (_event: IpcMainEvent, params?: DialogHandlerParams) => {
  beforeDialogClose(_event, DialogResponseType.Cancel, params);
};

const closeEvent = (_event: IpcMainEvent, params: DialogHandlerParams = { config: { isCloseModal: true } }) => {
  beforeDialogClose(_event, DialogResponseType.Cancel, params);
};

const getDialogContext = (_event: IpcMainInvokeEvent) => {
  const contentId = _event.sender.id;
  const winCache = getDialogCache(contentId);
  if (winCache?.context == null) return null;
  return winCache?.context;
};

/** 重新给页面发送context数据 */
const resendChildContext = (_event: IpcMainInvokeEvent) => {
  const contentId = _event.sender.id;
  return resendChildContextData(contentId);
};

const setDialogEnabled = (_event: IpcMainEvent, enabled: boolean) => {
  const contentsId = _event.sender.id;
  const win = WindowManager.getByContentsId(contentsId);
  win?.object?.setEnabled(enabled);
};

/** 窗口置顶 */
const setDialogAlwaysOnTop = (_event: IpcMainInvokeEvent, isAlwaysOnTop: boolean) => {
  const { id } = _event.sender;
  const win = WindowManager.getByContentsId(id);
  if (!win?.object) return null;
  win.object.setAlwaysOnTop(isAlwaysOnTop, getOnTopLevel());
  return isAlwaysOnTop;
};
// --ipc回调 end

const setLockWindowFocus = () => {
  const currentLockWindow = getCurrentLockWindow();
  if (currentLockWindow != null) {
    WindowManager.focus(currentLockWindow.name);
    currentLockWindow.object?.moveTop();
  }
};

const setSelfWindowLock = (_event: IpcMainEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (win?.object == null) return;
  lockDialog(win);
};

const setCancelWindowLock = (_event: IpcMainEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (win?.object == null) return;
  cancelSelfWindowLock(win);
};

/**
 * 修改当前窗口尺寸
 * @param _event 事件对象
 * @param width 宽度, 传null表示使用原有宽度
 * @param height 高度, 传null表示使用原有高度
 * @returns void
 */
const setWindowSize = (_event: IpcMainInvokeEvent, width: number | null, height: number | null) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (!win?.isAlive()) return;
  const bounds = win?.getBounds();
  if (!bounds) return;
  if (width == null) {
    width = win?.options?.width || bounds.width;
  }
  if (height == null) {
    height = win?.options?.height || bounds.height;
  }
  if (width && height) {
    win?.setBounds({ width: Math.floor(width), height: Math.floor(height), x: bounds.x, y: bounds.y });
  }
};

/** 首页preload时，主动获取要恢复哪些缓存的窗口，以便能够判断出当前active的行情看板 */
const getProductPanelCacheWindow = (_event: IpcMainInvokeEvent) => getAllCachedProductPanelGroupIds();

const start = () => {
  /** 窗口的确认、提交回调 */
  ipcMain.on(DialogEvent.Confirm, dialogSuccess);
  ipcMain.on(DialogEvent.Cancel, dialogCancel);
  ipcMain.handle(DialogEvent.CloseByName, closeByName);
  ipcMain.handle(DialogEvent.GetContext, getDialogContext);
  ipcMain.handle(DialogEvent.ResendChildContext, resendChildContext);
  ipcMain.on(DialogEvent.SetEnabled, setDialogEnabled);
  ipcMain.handle(DialogEvent.SetDialogAlwaysOnTop, setDialogAlwaysOnTop);
  ipcMain.handle(DialogEvent.SetWindowSize, setWindowSize);
  ipcMain.handle(IPCEventEnum.SetLockWindowFocus, setLockWindowFocus);
  ipcMain.on(IPCEventEnum.LockCurrentWindow, setSelfWindowLock);
  ipcMain.on(IPCEventEnum.UnLockCurrentWindow, setCancelWindowLock);
  ipcMain.handle(DialogEvent.GetProductPanelCacheWindows, getProductPanelCacheWindow);
  ipcMain.on(IPCEventEnum.Close, closeEvent);
};

const end = () => {
  /** 窗口的确认、提交回调 */
  ipcMain.off(DialogEvent.Confirm, dialogSuccess);
  ipcMain.off(DialogEvent.Cancel, dialogCancel);
  ipcMain.off(DialogEvent.CloseByName, closeByName);
  ipcMain.off(DialogEvent.GetContext, dialogCancel);
  ipcMain.off(DialogEvent.ResendChildContext, resendChildContext);
  ipcMain.off(DialogEvent.SetEnabled, setDialogEnabled);
  ipcMain.off(DialogEvent.SetDialogAlwaysOnTop, setDialogAlwaysOnTop);
  ipcMain.off(DialogEvent.SetWindowSize, setWindowSize);
  ipcMain.off(IPCEventEnum.SetLockWindowFocus, setLockWindowFocus);
  ipcMain.off(IPCEventEnum.LockCurrentWindow, setSelfWindowLock);
  ipcMain.off(IPCEventEnum.UnLockCurrentWindow, setCancelWindowLock);
  ipcMain.off(DialogEvent.GetProductPanelCacheWindows, getProductPanelCacheWindow);
  ipcMain.off(IPCEventEnum.Close, closeEvent);
};

/**
 * 系统级窗口相关Listener
 */
export default () => [start, end];
