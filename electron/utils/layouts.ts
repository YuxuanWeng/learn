import { NormalWindow } from 'app/windows/models/normal-window';
import { powerMonitor, screen } from 'electron';
import { checkIsProductPanel } from '@packages/utils';
import { OmsApplicationStatusEnum, omsApp } from '../models/oms-application';
import { LayoutSettingsProductItem } from '../types/types';
import { WindowInstance } from '../types/window-type';
import { WindowName } from '../types/window-v2';
import { BasicWindow } from '../windows/models/basic-window';
import { SpecialWindow } from '../windows/models/special-window';
import { WindowManager } from '../windows/models/windows-manager';
import { userInitConfigStorage } from '../windows/store/user-init-config-storage';
import { windowOpenedStorage } from '../windows/store/window-opened-storage';

/**
 * 设置一个布局缓存的版本号，防止某版本改动过大，引起非预期内的问题
 * TODO: a/b 功能放开后，可放入 a/b 中
 */
export const LAYOUT_VERSION = 'v3';

/** 是否需要对二级页进行布局恢复，默认为 false */
let isLayoutOfSecondary = false;
export const setIsLayoutOfSecondary = (isLayout: boolean) => {
  isLayoutOfSecondary = isLayout;
};

/** 获取所有已打开 && 需要保存布局的窗口 */
const getAllLayoutWindow = () => {
  const allWindow = WindowManager.getAll();
  const windowItems = new Set<string>();
  return allWindow.filter(win => {
    if (!win?.name) return false;
    return checkIsProductPanel(win?.name) || (isLayoutOfSecondary && windowItems.has(win?.name));
  });
};

/** 获取需要缓存的台子信息 */
export const getOpenLayoutWindows = () => {
  const layoutWindows = getAllLayoutWindow();
  const userConfig = userInitConfigStorage.getUserInitConfig();
  const userId = userConfig?.userInfo?.user_id;
  const productType = userConfig?.productType;
  return layoutWindows.map(win => {
    const { custom, options } = win;
    const params: LayoutSettingsProductItem = {
      ...win.getSelfProps(),
      custom,
      options,
      winBounds: win?.getBounds(),
      version: LAYOUT_VERSION,
      userId,
      productType
    };

    if (params.winBounds) {
      params.winBounds.isMaximized = win?.isMaximized();
      const display = screen.getDisplayMatching(params.winBounds);
      params.winBounds.displayId = display?.id;
      params.winBounds.scaleFactor = display?.scaleFactor;
      params.winBounds.displayBounds = display?.bounds;
    }
    return params;
  });
};

let layoutSettingsProductList: LayoutSettingsProductItem[] = [];

/**
 * 写入需要重登后恢复的布局窗口
 * @param excludes WindowInstance[] 不需要被保存的窗口
 * @param fromHomeClose boolean 是否来自首页关闭
 */
export const writeLayoutWindows = async (excludes: WindowInstance[] = [], fromHomeClose = false): Promise<boolean> => {
  const innerHelper = () => {
    const home = WindowManager.get(WindowName.MainHome) as BasicWindow;
    if (!fromHomeClose) return;
    if (home) home.layoutCacheSaved = true;
    home?.close();
  };
  try {
    if (
      !windowOpenedStorage.judgeWrite() ||
      !WindowManager.get(WindowName.MainHome)?.isAlive() ||
      powerMonitor.getSystemIdleState(5) === 'locked'
    ) {
      innerHelper();
      return false;
    }
    const userConfig = userInitConfigStorage.getUserInitConfig();
    const userId = userConfig?.userInfo?.user_id;
    layoutSettingsProductList = getOpenLayoutWindows();
    await windowOpenedStorage.clear(LAYOUT_VERSION, userId);
    for (const layout of layoutSettingsProductList) {
      if (!excludes.some(w => w.name === layout.name)) windowOpenedStorage.set(layout.name, layout);
    }
    if (layoutSettingsProductList.length) await windowOpenedStorage.writeAll();
    innerHelper();
  } catch {
    innerHelper();
    return false;
  }
  return true;
};

export const judgeAppQuitByLayout = (ev?: Electron.Event, win?: WindowInstance) => {
  if (
    win?.isAlive() &&
    win.isHome() &&
    win.constructor === BasicWindow &&
    !win.layoutCacheSaved &&
    omsApp.status !== OmsApplicationStatusEnum.SwitchingProduct &&
    omsApp.status !== OmsApplicationStatusEnum.BeforeUpdate
  ) {
    writeLayoutWindows([], true);
    if (ev) {
      ev.preventDefault();
      ev.returnValue = false;
    }
    return false;
  }
  return true;
};

export const judgeLayoutForResized = (win: WindowInstance) => {
  if (!win) return;
  if (!checkIsProductPanel(win?.name) || win.isHome()) return;
  if (win.constructor === NormalWindow && win.isInPool) return;
  if (win.constructor === SpecialWindow && !win.object?.isVisible()) return;
  if (
    omsApp.status !== OmsApplicationStatusEnum.AutoLogout &&
    omsApp.status !== OmsApplicationStatusEnum.SwitchingProduct &&
    omsApp.status !== OmsApplicationStatusEnum.BeforeUpdate
  ) {
    writeLayoutWindows([], false);
  }
};
