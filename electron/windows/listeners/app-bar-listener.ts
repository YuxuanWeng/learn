import IPCEventEnum, { CycleEventEnum, SystemEventEnum } from 'app/types/IPCEvents';
import { WindowInstance } from 'app/types/window-type';
import { WindowName } from 'app/types/window-v2';
import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, ipcMain, screen } from 'electron';
import { round } from 'lodash-es';
import { OmsApplicationStatusEnum, omsApp } from '../../models/oms-application';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIGHT } from '../constants';
import { WindowManager } from '../models/windows-manager';
import { getCursorScreenPointScale } from '../windows-tools';

type WindowSizeModule = {
  width: number;
  height: number;
};

const minimizeEvent = (_event: IpcMainInvokeEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id)?.object;
  if (win != null && win?.isMinimized()) win.restore();
  else win?.minimize();
};

const maximizeEvent = (_event: IpcMainInvokeEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (win != null && win?.isMaximized()) win?.unmaximize();
  else win?.maximize();
};

/** 获取窗口从最大化恢复时的尺寸 */
const getWindowMinimumSize = (win: WindowInstance | null) => {
  if (!win?.object) return [DEFAULT_WINDOW_WIGHT, DEFAULT_WINDOW_HEIGHT];
  if (win.boundsBeforeMaximize == null) return win?.object.getMinimumSize();
  const { width, height } = win.boundsBeforeMaximize;
  return [width, height];
};
const winToUnMaximize = (win: WindowInstance | null) => {
  if (!win?.isAlive()) return;
  if (win.boundsBeforeMaximize == null) {
    win.unmaximize();
  } else {
    const { x, y, width, height } = win.boundsBeforeMaximize;
    win.setBounds({
      x,
      y,
      width,
      height
    });

    win.boundsBeforeMaximize.isRestored = false;
  }
};

const toggleMaximize = (_event: IpcMainInvokeEvent) => {
  const curWindow = WindowManager.getByContentsId(_event.sender.id);
  let isMaximize = false;
  if (curWindow != null && curWindow.isMaximized()) {
    winToUnMaximize(curWindow);
  } else {
    curWindow?.maximize();
    isMaximize = true;
  }
  return isMaximize;
};

const getIsMaximized = (_event: IpcMainInvokeEvent) => {
  return WindowManager.getByContentsId(_event.sender.id)?.isMaximized() ?? false;
};

/** --- 窗口拖动 start --- */
let canMoving = false;
let currentMovingWindow: BrowserWindow | null = null;

let winStartPosition = { x: 0, y: 0 };
let mouseStartPosition = { x: 0, y: 0 };
const winSize: WindowSizeModule = { width: DEFAULT_WINDOW_WIGHT, height: DEFAULT_WINDOW_HEIGHT };

/**
 * 窗口移动事件
 * @returns isInvalid, 只有在非预期的时候返回true
 */
const windowMoving = () => {
  if (currentMovingWindow == null || BrowserWindow?.getFocusedWindow()?.id !== currentMovingWindow?.id) {
    return true;
  }

  const instanceWindow = WindowManager.getById(currentMovingWindow.id);
  const cursorPosition = screen.getCursorScreenPoint();
  if (
    !canMoving &&
    instanceWindow?.isMaximized() &&
    (cursorPosition.x !== mouseStartPosition.x || cursorPosition.y !== mouseStartPosition.y)
  ) {
    currentMovingWindow.unmaximize();
    setTimeout(() => {
      canMoving = true;
    }, 200);
    return false;
  }

  if (!canMoving || !currentMovingWindow || currentMovingWindow?.isDestroyed()) return false;
  const x = round(winStartPosition.x + cursorPosition.x - mouseStartPosition.x);
  const y = round(winStartPosition.y + cursorPosition.y - mouseStartPosition.y);
  currentMovingWindow.setBounds({
    ...winSize,
    x,
    y
  });
  return false;
};

const winWillMove = (_event: IpcMainInvokeEvent) => {
  const win = WindowManager.getByContentsId(_event.sender.id);
  if (win?.object == null) return;
  currentMovingWindow = win.object;
  if (currentMovingWindow == null) return;
  const winPosition = currentMovingWindow.getPosition();
  /**
   * 这里，不能使用 window.getSize() 获取窗口大小
   * 在 dpi非1 的显示器中，electron的getSize获取到的高度每次会有1像素的误差
   * 需要使用 window.getContentSize 来获取精准大小
   * */
  [winSize.width, winSize.height] = win.getContentSize() ?? currentMovingWindow.getContentSize();
  winStartPosition = { x: winPosition[0], y: winPosition[1] };
  mouseStartPosition = screen.getCursorScreenPoint();
  if (!win.isMaximized() || win.name === WindowName.SpotPricingHint) canMoving = true;
  else {
    const windowMinimumSize = getWindowMinimumSize(win);
    const [windowMinimizedX] = getCursorScreenPointScale(currentMovingWindow, windowMinimumSize);
    [winSize.width, winSize.height] = windowMinimumSize;
    winStartPosition.x = windowMinimizedX;
  }
};
const winWillMoveEnd = () => {
  canMoving = false;
  currentMovingWindow = null;
  winStartPosition = { x: 0, y: 0 };
  mouseStartPosition = { x: 0, y: 0 };
  [winSize.width, winSize.height] = [DEFAULT_WINDOW_WIGHT, DEFAULT_WINDOW_HEIGHT];
};

/** --- 窗口拖动 end --- */

const userHomeClose = () => omsApp.setAppStatus(OmsApplicationStatusEnum.UserCloseHome);

const forceOpenDevTools = (_event: IpcMainEvent) => {
  BrowserWindow.fromWebContents(_event.sender)?.webContents?.toggleDevTools();
};

const start = () => {
  ipcMain.on(IPCEventEnum.Minimize, minimizeEvent);
  ipcMain.on(IPCEventEnum.Maximize, maximizeEvent);
  ipcMain.handle(IPCEventEnum.ToggleMaximize, toggleMaximize);
  ipcMain.handle(IPCEventEnum.GetIsMaximized, getIsMaximized);
  ipcMain.handle(IPCEventEnum.WindowMoving, windowMoving);
  ipcMain.handle(IPCEventEnum.WindowWillMove, winWillMove);
  ipcMain.on(IPCEventEnum.WindowMoveEnd, winWillMoveEnd);
  ipcMain.handle(CycleEventEnum.UserHomeClose, userHomeClose);
  ipcMain.on(SystemEventEnum.ForceOpenDevTools, forceOpenDevTools);
};

const end = () => {
  ipcMain.off(IPCEventEnum.Minimize, minimizeEvent);
  ipcMain.off(IPCEventEnum.Maximize, maximizeEvent);
  ipcMain.off(IPCEventEnum.ToggleMaximize, toggleMaximize);
  ipcMain.off(IPCEventEnum.GetIsMaximized, getIsMaximized);
  ipcMain.off(IPCEventEnum.WindowMoving, windowMoving);
  ipcMain.off(IPCEventEnum.WindowWillMove, winWillMove);
  ipcMain.off(IPCEventEnum.WindowMoveEnd, winWillMoveEnd);
  ipcMain.off(CycleEventEnum.UserHomeClose, userHomeClose);
  ipcMain.off(SystemEventEnum.ForceOpenDevTools, forceOpenDevTools);
};

/**
 * 窗体-bar 的功能按扭交互
 */
export default () => [start, end];
