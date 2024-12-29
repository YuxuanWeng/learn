import { BrowserWindow, screen } from 'electron';
import { round } from 'lodash-es';
import { checkIsHomeOrProductPanel } from '@packages/utils';
import { WindowInstance } from '../types/window-type';
import { WindowName } from '../types/window-v2';
import { isProd } from '../utils/electron-is-dev';
import { getIsDevToolsInProd } from './listeners/ab-rules-listener';
import { WindowManager } from './models/windows-manager';

/**
 * 获取窗口相对鼠标位置的，从最大化状态-->恢复时的坐标信息
 * @param win 当前窗口
 * @param minimumSize 最小化状态的尺寸
 */
export const getCursorScreenPointScale = (win: BrowserWindow, minimumSize: number[]) => {
  const cursorScreenPoint = screen.getCursorScreenPoint();
  const currentWindowBounds = win.getBounds();
  /** 当前（最大化）时鼠标坐标相对窗口x、y轴的距离 */
  const [maximizedRelativeX, maximizedRelativeY] = [
    cursorScreenPoint.x - currentWindowBounds.x,
    cursorScreenPoint.y - currentWindowBounds.y
  ];
  /** 当前窗口大小/鼠标坐标距离（比例） */
  const [xScale, yScale] = [
    currentWindowBounds.width / maximizedRelativeX,
    currentWindowBounds.height / maximizedRelativeY
  ];
  /** 窗口“恢复”时的尺寸 */
  const [minimumWidth, minimumHeight] = minimumSize;
  /** 窗口恢复后鼠标的相对位置 */
  const [minimizedRelativeX, minimizedRelativeY] = [minimumWidth / xScale, minimumHeight / yScale];
  /** 窗口“恢复”后的坐标 */
  const windowMinimizedX = round(cursorScreenPoint.x - minimizedRelativeX);
  const windowMinimizedY = round(cursorScreenPoint.y - minimizedRelativeY);
  return [windowMinimizedX, windowMinimizedY];
};

export const isDevToolsDisabled = () => isProd() && !getIsDevToolsInProd();

/** 处理windows下,同时有多个置顶窗口时,首次打开置顶失效的问题 */
export const changeWindowOnTopByFocus = (win: WindowInstance) => {
  const allWindowItems = WindowManager.getWindows();
  const hasTopWindow = allWindowItems.some(
    w => w?.name !== win?.name && w?.object?.isVisible() && w?.object?.isAlwaysOnTop()
  );
  if (hasTopWindow && win?.object?.isAlwaysOnTop()) win?.object?.moveTop();
};

/** 获取首页窗口 */
export const getHomeWindow = () => WindowManager.get(WindowName.MainHome);
/** 获取首页窗口是否存活 */
export const homeWindowIsAlive = () => !!getHomeWindow()?.isAlive();
/** 是否为首页或行情看板页 */
export const isHomeOrProductPanel = (win: WindowInstance) => checkIsHomeOrProductPanel(win.name);
