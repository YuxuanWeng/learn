import { Rectangle, powerMonitor, screen } from 'electron';
import { OmsApplicationStatusEnum, omsApp } from '../models/oms-application';
import { LayoutSettingsProductItem, WindowBounds } from '../types/types';
import { WindowInstance } from '../types/window-type';
import { WindowName } from '../types/window-v2';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIGHT, NEED_CACHE_BONDS_WINDOWS } from '../windows/constants';
import { WindowManager } from '../windows/models/windows-manager';
import { userInitConfigStorage } from '../windows/store/user-init-config-storage';
import { windowOpenedStorage } from '../windows/store/window-opened-storage';
import { windowBoundsStorage } from '../windows/store/window-size-storage';
import { delayHelper } from './utools';

/** 检测指定 bounds 是否在指定显示器内可见 */
export const getBoundsVisibleInDisplay = (bounds: Electron.Rectangle, display: Electron.Display) => {
  const isXVisible = display.bounds.width + display.bounds.x > bounds.x && bounds.width + bounds.x > display.bounds.x;

  const isYVisible = display.bounds.height + display.bounds.y > bounds.y && bounds.height + bounds.y > display.bounds.y;

  return isXVisible && isYVisible;
};

/** 返回需要缓存边界信息的窗口名称 */
const getWindowSizeStorageItems = (): string[] => NEED_CACHE_BONDS_WINDOWS;

/** 获取窗口在保存位置时的 key */
export const getWindowSizeStorageKey = (name: string) => {
  const prefix = 'window_size_storage';
  const userConfig = userInitConfigStorage.getUserInitConfig();
  const userId = userConfig?.userInfo?.user_id;
  if (!userId) return null;
  if (getWindowSizeStorageItems().includes(name) || name.startsWith(WindowName.ProductPanel)) {
    return `${name}_${userId}_${prefix}`;
  }
  const key = [WindowName.SingleBond].find(n => name.startsWith(n));
  return key == null ? null : `${key}_${userId}_${prefix}`;
};

/** 获取指定 name 的窗口已存储的尺寸 */
export const getStoredBounds = (name: string) => {
  const key = getWindowSizeStorageKey(name);
  if (key == null) return null;
  return windowBoundsStorage.get(key);
};

/** 保存需要缓存位置信息的窗口 */
export const setWindowBoundsCache = (win: WindowInstance) => {
  if (win.object == null) return;
  const boundsStorageKey = getWindowSizeStorageKey(win.name);

  if (boundsStorageKey == null) return;
  const isMaximized = win.isMaximized();
  const bounds = win.getBounds();
  if (!bounds) return;

  const userConfig = userInitConfigStorage.getUserInitConfig();
  const userId = userConfig?.userInfo?.user_id;
  const display = screen.getDisplayMatching(bounds);

  windowBoundsStorage.set(boundsStorageKey, {
    ...bounds,
    isMaximized,
    displayId: display?.id,
    scaleFactor: display?.scaleFactor,
    displayBounds: display?.bounds,
    boundsBeforeMaximize: isMaximized ? win.boundsBeforeMaximize : undefined,
    userId
  });
};

/**
 * 判断是否需要在某些固定实际保存bounds信息
 * @param win 当前窗口
 * @param fromClose 是否来自关闭行为，mac下，isVisible不太可信，进入 “close” 阶段就会为 false；
 */
export const judgeSetWindowBoundsCache = (win: WindowInstance, fromClose = false) => {
  if (getWindowSizeStorageKey(win.name) != null && (win.object?.isVisible() === true || fromClose)) {
    setWindowBoundsCache(win);
  }
};

// 处理一个很奇怪的问题，setSize和setMinimumSize调用时间相近会导致
// 当setSize不符合SetMinimumSize的约束时，会被setMinimumSize覆盖
// 且此约束会重复计算两次屏幕的 scaleFactor
// 但是其他情况下(如之后再拖动缩小窗口)只计算一次 scaleFactor
const setMinAndMax = async (win: WindowInstance, delay = 42) => {
  const { options } = win;
  if (options.minWidth || options.minHeight) {
    win.object?.setMinimumSize(options.minWidth || 0, options.minHeight || 0);

    await delayHelper(delay)();
  }
  if (options.maxWidth || options.maxHeight) {
    win.object?.setMaximumSize(options.maxWidth || DEFAULT_WINDOW_WIGHT, options.maxHeight || DEFAULT_WINDOW_HEIGHT);
    await delayHelper(delay)();
  }
  return true;
};

// -- 修改尺寸 start
/** 获取主屏幕大小与窗口大小的差的一半 */
const getHalf = (bigWidth: number, smallWidth: number) => Math.floor(Math.abs(bigWidth - smallWidth) / 2);

const getWindowToCenterPosition = (display: Electron.Display, width: number, height: number) => {
  const { width: w, height: h, x, y } = display.workArea;
  if (width > w || height > h) {
    return [x, y];
  }
  const hx = getHalf(w, width);
  const hy = getHalf(h, height);
  return [x + hx, y + hy];
};

/**
 * 将窗口位置设置到对应显示器的中心位置
 * @param win 窗口实例
 * @param display 显示器实例
 * @param width 当前窗口宽
 * @param height 当前窗口高
 * @returns
 */
const setToScreenCenter = (win: WindowInstance, display: Electron.Display, width: number, height: number) => {
  const [x, y] = getWindowToCenterPosition(display, width, height);
  win?.setPosition(x, y);
};

/**
 * 修正窗口尺寸（：windows笔记本在主显示屏设置缩放比例后，会影响新增窗口的尺寸计算
 * @param win 窗口实例
 * @param display 显示器实例
 */
export const setWindowBounds = async (win: WindowInstance, display: Electron.Display, delay = 32) => {
  const { workArea, bounds } = display;

  const { options, custom } = win;
  const [width, height] = WindowManager.getWindowDisplaySize(win.name);

  // 全屏
  if (custom.isFullScreen) {
    setToScreenCenter(win, display, width, height);
    win.maximize();
  } else if (custom.isFullHeight) {
    // 高满屏
    win.setContentSize(width, workArea.height, false);
    setToScreenCenter(win, display, width, workArea.height);
  } else if (custom.isFullWidth) {
    // 宽满屏
    win.setContentSize(workArea.width, height, false);
    setToScreenCenter(win, display, workArea.width, height);
  } else if (bounds.width >= width && bounds.height >= height) {
    win.setContentSize(width, height, false);
    if (
      options.x != null &&
      options.y != null &&
      getBoundsVisibleInDisplay({ width, height, x: options.x, y: options.y }, display)
    ) {
      // 用户设置了坐标
      win?.setPosition(options.x, options.y);
    } else {
      setToScreenCenter(win, display, width, height);
    }
  } else if (workArea.width < width && workArea.height < height) {
    win.setContentSize(workArea.width, workArea.height, false);
    setToScreenCenter(win, display, width, height);
  } else {
    win.setContentSize(width, height, false);
    setToScreenCenter(win, display, width, height);
  }
  await delayHelper(delay)();
  return true;
};

/**
 * 修改窗口尺寸之前，判断焦点屏幕与实际要渲染窗口的屏幕非同一个，做特殊处理
 * @param w 当前窗口
 * @param externalDisplay 要显示的目标屏幕
 * @param callback 设置大小的回调
 */
const changeWindowBoundsAfterJudge = async (w: WindowInstance, externalDisplay: Electron.Display, delay = 260) => {
  /**
   * 处理一个比较极端的情况：
   * 焦点窗口与鼠标不在同一显示器 且 两个显示器像素比不同 且 一般通过快捷键才会出现窗口比例来不及重算的情况
   */
  const winBounds = w?.getBounds();
  if (winBounds != null) {
    const windowDisplay = screen.getDisplayMatching(winBounds);
    if (windowDisplay.id !== externalDisplay.id || windowDisplay.scaleFactor !== externalDisplay.scaleFactor) {
      const [width, height] = WindowManager.getWindowDisplaySize(w.name);
      setToScreenCenter(w || null, externalDisplay, width, height);
      // isSameDisplay = false;
      await delayHelper(delay)();
    }
  }
  return true;
};
// -- 修改尺寸 end

const getWindowSize = (win: WindowInstance, bounds: WindowBounds) => {
  let [width, height] = [DEFAULT_WINDOW_WIGHT, DEFAULT_WINDOW_HEIGHT];
  const isResizable = win?.options.resizable ?? win.object?.isResizable();
  if (isResizable === false) {
    [width, height] = WindowManager.getWindowDisplaySize(win.name);
  } else {
    [width, height] = [bounds.width, bounds.height];
  }
  return [Math.floor(width), Math.floor(height)];
};

/**
 * // -- 1、计算出实际要使用的 bounds 值
 * // -- -- 1.1、获取缓存的值，如果有，需要考虑鼠标位置
 * // -- -- 1.2、没有缓存值，则使用参数的 winBounds
 * // -- -- 1.3、没有参数的 winBounds，使用窗口自身 params 计算得出
 * @param win 当前窗口
 * @param winBounds 要设置的bounds信息，一般只有刷新场景会传
 * @returns 得出的实际的bounds
 */
const getWindowBounds = (win: WindowInstance, winBounds?: WindowBounds): WindowBounds => {
  const cacheBounds = getStoredBounds(win.name);
  if (cacheBounds) return { ...cacheBounds, fromCache: true };
  if (winBounds) return { ...winBounds, fromCache: true };
  const [width, height] = WindowManager.getWindowDisplaySize(win.name);
  const [x, y] = [win.options?.x, win.options?.y];
  return { width, height, x, y, fromCache: false };
};

const getParentDisplay = (parentId?: number) => {
  if (!parentId) return undefined;
  const parent = WindowManager.getByContentsId(parentId);
  const parentBounds = parent?.getBounds();
  if (parentBounds) {
    return screen.getDisplayMatching(parentBounds);
  }
  return undefined;
};

const getDisplay = (win: WindowInstance, bounds: WindowBounds): Electron.Display => {
  const currentBounds = bounds as Rectangle;

  if (bounds.fromCache && bounds.displayId && !screen.getAllDisplays().some(d => d.id === bounds.displayId)) {
    return getParentDisplay(win.parentId) ?? screen.getPrimaryDisplay();
  }
  if (bounds.fromCache && bounds.x != null && bounds.y != null) {
    const cacheDisplayBounds = bounds.displayBounds;
    const matchingDisplay = screen.getDisplayMatching(currentBounds);
    const { width, height, x, y } = matchingDisplay.bounds;
    if (
      cacheDisplayBounds?.width === width &&
      cacheDisplayBounds?.height === height &&
      cacheDisplayBounds?.x === x &&
      cacheDisplayBounds?.y === y &&
      bounds.scaleFactor === matchingDisplay.scaleFactor
    ) {
      return matchingDisplay;
    }
    return getParentDisplay(win.parentId) ?? screen.getPrimaryDisplay();
  }
  /** 用户强制指定位置 */
  if (bounds.x != null && bounds.y != null) {
    return screen.getDisplayMatching(currentBounds);
  }
  /** 当前鼠标的绝对位置 */
  const cursorPoint = screen.getCursorScreenPoint();
  return screen.getDisplayNearestPoint(cursorPoint);
};

const buildChangeBoundsQueue = (win: WindowInstance, display: Electron.Display) => {
  return [() => changeWindowBoundsAfterJudge(win, display, 260), () => setWindowBounds(win, display)];
};

const setBoundsBeforeMaximize = (win: WindowInstance, bounds: WindowBounds, display: Electron.Display) => {
  const { minWidth, minHeight } = win.options;
  if (bounds.boundsBeforeMaximize) {
    win.boundsBeforeMaximize = bounds.boundsBeforeMaximize;
    win.boundsBeforeMaximize.isRestored = true;
  } else if (!win.boundsBeforeMaximize && win.custom.isFullScreen && win.options.resizable) {
    const width = minWidth && minWidth > DEFAULT_WINDOW_WIGHT ? minWidth : DEFAULT_WINDOW_WIGHT;
    const height = minHeight && minHeight > DEFAULT_WINDOW_HEIGHT ? minHeight : DEFAULT_WINDOW_HEIGHT;
    const [x, y] = getWindowToCenterPosition(display, DEFAULT_WINDOW_WIGHT, DEFAULT_WINDOW_HEIGHT);
    win.boundsBeforeMaximize = {
      width,
      height,
      x: x ?? 0,
      y: y ?? 0,
      isRestored: true
    };
  }
};

/**
 * 设置窗口边界（宽高坐标）
 * @param win 当前窗口
 * @param winBounds 要设置的bounds信息，一般只有刷新场景会传
 * @returns boolean 是否设置成功
 */
export const changeBoundsByParams = async (win: WindowInstance | null, winBounds?: WindowBounds): Promise<boolean> => {
  if (!win) return false;
  // -- 1、计算出实际要使用的 bounds 值
  // -- -- 1.1、获取缓存的值，如果有，需要考虑鼠标位置
  // -- -- 1.2、没有缓存值，则使用参数的 winBounds
  // -- -- 1.3、没有参数的 winBounds，使用窗口自身 params 计算得出
  // -- 2、校验 bounds 对应的显示器是否存在，不存在则重新计算实际要显示到的位置
  // -- 3、使用 bounds 值修改窗口位置
  // -- -- 3.1、是否需要 setMinAndMax
  try {
    const { custom, options } = win;
    const bounds = getWindowBounds(win, winBounds);

    [bounds.width, bounds.height] = getWindowSize(win, bounds);

    if (bounds.fromCache) {
      custom.isFullScreen = !!bounds.isMaximized;
    }

    win.options = { ...options, ...bounds };

    const display = getDisplay(win, bounds);
    const queue = buildChangeBoundsQueue(win, display);
    await WindowManager.pipe(queue);

    setBoundsBeforeMaximize(win, bounds, display);
    /**
     * -- changeBounds完成后，如果当前窗口需要设置缓存 & 还没保存缓存时，主动进行一次缓存的保存；
     */
    setTimeout(
      (w: WindowInstance) => {
        WindowManager.pipe([
          () => setMinAndMax(w),
          delayHelper(300),
          () => {
            return new Promise<boolean>(innerResolve => {
              judgeSetWindowBoundsCache(w);
              innerResolve(true);
            });
          }
        ]);
      },
      800,
      win
    );

    return true;
  } catch {
    return false;
  }
};

const checkLayoutDisplay = (allDisplay: Electron.Display[], layout?: LayoutSettingsProductItem): boolean => {
  if (layout?.winBounds?.displayId == null) return true;
  const display = allDisplay.find(d => d.id === layout?.winBounds?.displayId);
  if (display == null) return false;
  const { scaleFactor, displayBounds } = layout.winBounds;
  if (scaleFactor != null && scaleFactor !== display.scaleFactor) return false;
  if (displayBounds != null) {
    if (displayBounds.width !== display.bounds.width) return false;
    if (displayBounds.height !== display.bounds.height) return false;
    if (displayBounds.x !== display.bounds.x) return false;
    if (displayBounds.y !== display.bounds.y) return false;
  }
  return true;
};

const checkBoundsDisplay = (allDisplay: Electron.Display[], bounds?: WindowBounds): boolean => {
  if (bounds?.displayId == null) return true;
  const display = allDisplay.find(d => d.id === bounds?.displayId);
  if (display == null) return false;
  const { scaleFactor, displayBounds } = bounds;
  if (scaleFactor != null && scaleFactor !== display.scaleFactor) return false;
  if (displayBounds != null) {
    if (displayBounds.width !== display.bounds.width) return false;
    if (displayBounds.height !== display.bounds.height) return false;
    if (displayBounds.x !== display.bounds.x) return false;
    if (displayBounds.y !== display.bounds.y) return false;
  }
  return true;
};

/** 检查当前活跃的显示器，如果窗口相关缓存中的显示器信息不对，则clear */
const checkActiveDisplay = () => {
  const allDisplay = screen.getAllDisplays();
  const allLayoutCache = windowOpenedStorage.getKeys().map(key => windowOpenedStorage.get(key));
  for (const item of allLayoutCache) {
    if (checkLayoutDisplay(allDisplay, item) === false) {
      console.log('layout cache display not exist', item?.winBounds?.displayId);
      windowOpenedStorage.clear();
      break;
    }
  }

  const allBoundsCache = windowBoundsStorage.getKeys().map(key => windowBoundsStorage.get(key));
  for (const item of allBoundsCache) {
    if (checkBoundsDisplay(allDisplay, item) === false) {
      console.log('bounds cache display not exist', item?.displayId);
      windowBoundsStorage.clear();
      break;
    }
  }
};

/** 检查当前活跃的显示器，如果窗口相关缓存中的显示器信息不对，则清空 */
export const judgeCheckActiveDisplay = async () => {
  try {
    if (WindowManager.get(WindowName.Login)?.isAlive() || omsApp.status === OmsApplicationStatusEnum.LoginWindowReady) {
      return;
    }
    if (powerMonitor.getSystemIdleState(5) === 'locked') return;
    if (windowOpenedStorage.initPromise != null || windowBoundsStorage.initPromise != null) {
      await Promise.all([windowOpenedStorage.initPromise, windowBoundsStorage.initPromise]);
      checkActiveDisplay();
    }
  } catch {
    console.log('judgeCheckActiveDisplay error');
  }
};

export const displayMetricsChanged = () => {
  screen.on('display-metrics-changed', judgeCheckActiveDisplay);
  screen.on('display-removed', judgeCheckActiveDisplay);
};
