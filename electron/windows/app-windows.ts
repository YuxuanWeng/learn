import { ProductType } from '@fepkg/services/types/enum';
import { BrowserWindowConstructorOptions, app, screen } from 'electron';
import { debounce, isObject } from 'lodash-es';
import { join } from 'path';
import { URLSearchParams } from 'url';
import { v4 as uuidv4 } from 'uuid';
import * as windowPools from './pools/windows-pool';
import { OmsApplicationStatusEnum, omsApp } from '../models/oms-application';
import IPCEventEnum, { DialogEvent } from '../types/IPCEvents';
import { SingleQuoteDialogConfig } from '../types/dialog-config';
import { DialogResponseType } from '../types/dialog-v2';
import { CustomProps, LoginCreateParam, WindowCategory } from '../types/types';
import { WindowInstance } from '../types/window-type';
import { CommonRoute, WindowName } from '../types/window-v2';
import { getOnTopLevel } from '../utils/args';
import { changeBoundsByParams, judgeSetWindowBoundsCache, setWindowBounds } from '../utils/bounds-helper-v2';
import { judgeAppQuitByLayout, judgeLayoutForResized } from '../utils/layouts';
import { isMac, mergeConfig } from '../utils/utools';
import {
  DEFAULT_CUSTOM_WINDOW_PROPS,
  DEFAULT_WINDOW_HEIGHT,
  DEFAULT_WINDOW_WIGHT,
  FRAME_WINDOW_CONFIG,
  IDC_BOND_DETAILS,
  IDC_HOMES,
  IDC_SPOTS
} from './constants';
import { getDialogCache, removeDialogCache } from './dialog/context';
import { beforeCloseIQuoteCard, sendIQuoteCardChange } from './dialog/iquote-card';
import { lockDialog, modalDialog } from './dialog/lock';
import { closeMsgChannel } from './dialog/message-channel';
import { beforeCloseProductPanel, sendProductPanelChange } from './dialog/product-panel';
import { setWindowReadyTime, setWindowStartTime } from './listeners/app-performance-listener';
import { setShouldCloseLoading } from './listeners/loading-listener';
import { getRestartWindowFlag, monitorWindowError } from './listeners/window-crash-listener';
import { BaseWindow, BaseWindowProps, CreateDialogParams } from './models/base';
import { BasicWindow } from './models/basic-window';
import { NormalWindow } from './models/normal-window';
import { SpecialWindow } from './models/special-window';
import { WindowLifeCycleEnum } from './models/type';
import { WindowManager } from './models/windows-manager';
import { userInitConfigStorage } from './store/user-init-config-storage';
import { windowOpenedStorage } from './store/window-opened-storage';
import { windowBoundsStorage } from './store/window-size-storage';
import { changeWindowOnTopByFocus } from './windows-tools';

const READY_WINDOWS: string[] = [WindowName.MainHome, WindowName.Login];

export function getDefaultSrcUrl() {
  const port = process.env.PORT || 3000;
  return !app.isPackaged ? `http://localhost:${port}` : `file://${join(__dirname, '../src/out')}`;
}

const getDefaultWebPreferences = (): Electron.WebPreferences => ({
  sandbox: false,
  devTools: true,
  webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
  zoomFactor: 1,
  preload: join(__dirname, './preload.js')
});

/**
 * 向上查找，是否有置顶的父窗口
 * @param parentId 父窗口ContentsId
 * @returns WindowInstance
 */
const getTopParent = (parentId: number) => {
  let id = parentId;
  let parent = WindowManager.getByContentsId(id);
  while (parent?.isAlive()) {
    if (parent.object?.isAlwaysOnTop()) return parent;

    // 防止parentId相同造成死循环的问题
    if (parent?.parentId === parentId || parent.getContent()?.id === parent?.parentId) return null;
    id = parent?.parentId || 0;
    parent = WindowManager.getByContentsId(id);
  }
  return null;
};

/**
 * 设置父窗口（如果有置顶的父级）
 * @param parentId 父窗口ContentsId
 * @param options BrowserWindow配置项
 */
const setWindowLevel = (parentId: number, options: BrowserWindowConstructorOptions = {}) => {
  const topParent = getTopParent(parentId);
  if (!topParent?.object) return false;
  options.parent = topParent.object;
  return true;
};

/**
 * 根据当前窗口改变窗口池窗口位置；
 * 当前操作窗口位置改变，修正窗口池窗口位置，利于show的时候的效果
 */
const resetPoolWindowPosition = (parent: WindowInstance) => {
  if (!parent?.object) return;
  const bounds = parent.getBounds();
  if (!bounds) return;
  const parentDisplay = screen.getDisplayMatching(bounds);

  const setPosition = (win: WindowInstance) => {
    if (win.isAlive() && win.object?.isVisible() === false) {
      setWindowBounds(win, parentDisplay);
    }
  };

  windowPools.eachNormalPools(setPosition);
  windowPools.eachSpecialPools(setPosition);
};

/** 构建页面的url */
const buildPageUrl = (custom?: CustomProps) => {
  let pageUrl = getDefaultSrcUrl();
  let routeUrl = '';
  if (!custom) return { pageUrl, routeUrl };
  if ((custom.filename != null && custom.filename !== 'index.html') || app.isPackaged) {
    pageUrl = join(pageUrl, custom.filename as string);
  }
  if (custom.route) {
    pageUrl += custom.baseRoutePath + custom.route;
    routeUrl = custom.route;
  }
  if (custom.routePathParams?.length) {
    for (const param of custom.routePathParams) {
      let urlSupplement = '';
      if (!pageUrl.endsWith('/')) {
        urlSupplement = '/';
      }
      pageUrl += urlSupplement + param;
      routeUrl += urlSupplement + param;
    }
  }

  const urlParams = new URLSearchParams(custom.urlParams ?? '');
  if (custom.isFirst) {
    urlParams.set('isFirst', custom.isFirst.toString());
  }

  const params = urlParams.toString();
  if (params) {
    pageUrl += `?${params}`;
    routeUrl += `?${params}`;
  }
  return { pageUrl, routeUrl };
};

/**
 * 注册窗口自定义拖拽相关事件
 * @param win 窗口实例
 */
const registerWindowResizeEvent = (win: WindowInstance) => {
  const webContents = win.getContent();
  const window = win.object;
  if (!window || !webContents) return;

  const handleWindowWillResize = () => {
    webContents.postMessage(IPCEventEnum.WindowWillResize, true);
  };

  const handleWindowResized = () => {
    webContents.postMessage(IPCEventEnum.WindowResized, true);
    win?.getContent()?.postMessage(IPCEventEnum.ResetWindowIsMaximized, win.isMaximized());
  };

  window.on('will-resize', handleWindowWillResize);

  window.on('resized', handleWindowResized);

  /** 页面重新导航、刷新后删除事件 */
  webContents.once('did-finish-load', () => {
    window.off('will-resize', handleWindowWillResize);
    window.off('resized', handleWindowResized);
  });
};

/**
 * 窗口准备完毕后调用，目前首页、窗口池、特殊池子中的窗口都会在窗口准备完毕后走这里
 * @param win 窗口实例
 */
const handleAfterWindowReady = (win: WindowInstance) => {
  if (WindowManager.size() === 0) throw new Error('当前没有窗体');

  setWindowReadyTime(Date.now());
  // if (win.category === WindowCategory.Basic) win.object?.show();

  const { custom, options } = win;

  if (win.defaultOpenDevTools) {
    win.getContent()?.openDevTools();
  }

  // 为了解决windows上不触发该函数无法遮盖任务栏的情况，目前无论isTop是否为true，都设置一下展示的层级（level）
  win.object?.setAlwaysOnTop(custom.isTop === true, getOnTopLevel());

  if (options.resizable != null) {
    win.object?.setResizable(!!options.resizable);
  }

  // // 处理一个很奇怪的问题，setSize和setMinimumSize调用时间相近会导致
  // // 当setSize不符合SetMinimumSize的约束时，会被setMinimumSize覆盖
  // // 且此约束会重复计算两次屏幕的 scaleFactor
  // // 但是其他情况下(如之后再拖动缩小窗口)只计算一次 scaleFactor
  // const setMinAndMax = () => {
  //   if (options.minWidth || options.minHeight) {
  //     win.object?.setMinimumSize(options.minWidth || 0, options.minHeight || 0);
  //   }
  //   if (options.maxWidth || options.maxHeight) {
  //     win.object?.setMaximumSize(options.maxWidth || DEFAULT_WINDOW_WIGHT, options.maxHeight || DEFAULT_WINDOW_HEIGHT);
  //   }
  // };
  // setMinAndMax();

  // if (isNeedRestoreSize) restoreBounds(win, callback);
  // setTimeout(() => {
  //   setMinAndMax(win);
  // }, 1500);

  // 窗口显示，只有特殊池子的窗口在这里发送，其他窗口使用前端回传的方式；
  if (win.name && windowPools.hasInSpecialPools(win.name)) {
    win.getContent()?.postMessage(IPCEventEnum.AfterWindowReadyToShow, true);
  }

  /** 需要保证在 setResizable 之后  */
  if (win.object?.isResizable() === true) {
    registerWindowResizeEvent(win);
  }
};

/** 窗口Ready后需要做的事情 */
const windowReady = (win: WindowInstance) => {
  handleAfterWindowReady(win);

  const keys = windowOpenedStorage.getKeys();
  const isHome = win.isHome();
  const isNormal = win.isNormal() && !WindowManager.isInPool(win.name);
  const hasInitPool = isHome || isNormal;
  const hasInitNormalPool = windowPools.getNormalPoolsLen() < windowPools.windowPoolsLen;
  const hasInitSpecialPool = windowPools.getSpecialPoolsLen() < windowPools.specialPoolKeys.length;
  if (hasInitPool && hasInitSpecialPool) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    initSpecialWindowPools();
  }

  if (hasInitPool && hasInitNormalPool && !(isHome && keys.length === 0)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    initNormalWindowPools();
  }

  if (win.custom.isLock) {
    lockDialog(win);
  } else if (win.custom.isModal) {
    if (win.parentId) modalDialog(win, win.parentId);
  }

  win.object?.on('focus', () => !win.isBasic() && win.isAlive() && resetPoolWindowPosition(win));
  win.object?.on(
    'move',
    debounce(() => {
      // 有最大化功能当窗口才提供ResetWindowIsMaximized通知，目前是首页以及非窗口池中的Normal窗口
      const needJudgeMaximized = win.isHome() || (win.isNormal() && !WindowManager.isInPool(win.name));
      if (!needJudgeMaximized || !win.isAlive()) return;
      resetPoolWindowPosition(win);
      win.getContent()?.postMessage(IPCEventEnum.ResetWindowIsMaximized, win.isMaximized());
    }, 200)
  );
};

// /** 设置默认缩放 */
// const didFinishLoad = (win: WindowInstance) => {
//   win.getContent()?.setZoomFactor(1);
//   win.getContent()?.setVisualZoomLevelLimits(1, 1);
// };

const checkWindowPoolsByClose = (win: WindowInstance) => {
  if (windowPools.getSpecialPoolsLen() >= windowPools.specialPoolKeys.length) return;
  const homeIsAlive = WindowManager.get(WindowName.MainHome)?.isAlive();
  if (!homeIsAlive) return;

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (!win?.isAlive()) initSpecialWindowPools();
};

/** idc首页关闭的动作，关闭点价、单券详情 */
const closeIdcChildWindow = (win: WindowInstance) => {
  if (!win.isAlive() || !IDC_HOMES.includes(win.name)) return;
  /** 关闭所有打开的债券详情 */
  for (const item of WindowManager.getWindows()) {
    if (!item.isAlive()) continue;
    const needClose = [...IDC_SPOTS, ...IDC_BOND_DETAILS].some(v => item.name.startsWith(v));
    if (needClose) item.close();
  }
};

/**
 * 如果是dialog，尝试对其promise回调进行调用，防止意外关闭导致前端不能正常接受回调情况
 * 不会影响正常的success与cancel，调用success后promise进入已决状态，再次 resolve不会有错误；
 */
const resolveByDialogClose = (win: WindowInstance) => {
  const contentsId = win.getContent()?.id;
  if (!contentsId) return;
  const winCache = getDialogCache(contentsId);

  if (winCache && typeof winCache.resolve === 'function') {
    winCache.resolve({ type: DialogResponseType.Cancel });
    return;
  }
  if (!win?.parentId) return;
  const parentWindow = WindowManager.getByContentsId(win.parentId);
  parentWindow?.getContent()?.postMessage(DialogEvent.ChildWindowClosed, win.name);
};

export const beforeWindowClose = (win: WindowInstance, ev?: Electron.Event) => {
  win.setStatus(WindowLifeCycleEnum.BeforeClose);
  if (omsApp.status !== OmsApplicationStatusEnum.AutoLogout && !judgeAppQuitByLayout(ev, win)) return;

  win.getContent()?.postMessage(IPCEventEnum.BeforeWindowClose, WindowName.MainHome);

  beforeCloseProductPanel(win);
  beforeCloseIQuoteCard(win);

  judgeSetWindowBoundsCache(win, true);
  closeIdcChildWindow(win);
  resolveByDialogClose(win);

  // 这些事件不能放到closed，win.object可能会拿不到
  removeDialogCache(win.getContent()?.id ?? 0);
  closeMsgChannel(win.name);
  WindowManager.clearInvalidWindows();
  win.setStatus(WindowLifeCycleEnum.Closing);
};

const updateUnMaximizedBounds = (win: WindowInstance) => {
  // 特殊处理，防止同时 setPosition 和 setSize 之后
  setTimeout(() => {
    const bounds = win.getBounds();
    if (win.object == null || win.isMaximized() || !bounds) return;
    win.boundsBeforeMaximize = { ...bounds, isRestored: false };
  });
};

const beforeAppQuit = () => {
  windowBoundsStorage.queueThen().then(() => {
    WindowManager.closeAll();
    omsApp.quit();
  });
};

let checkWindowPoolsByCloseTimer: NodeJS.Timeout | null = null;
export const afterWindowClose = (win: WindowInstance, fromClosed = false) => {
  /** 进入 afterWindowClose 后，理论上窗口的关闭已经不能被阻断了，前置设置生命周期为 Closed */
  win.setStatus(WindowLifeCycleEnum.Closed);
  const isHome = win.isHome();
  if (fromClosed || !windowPools.specialPoolKeys.includes(win.name)) {
    win.object = null;
    WindowManager.delete(win.name);
  }

  /** 加入窗口池后，需要手动在每次关闭窗口时判断是否需要将所有窗口进行关闭 */
  if (getRestartWindowFlag()) return;
  const login = WindowManager.get(WindowName.Login);
  const loginNonExistent = login == null || !login.isAlive();
  const updateWindow = WindowManager.get(WindowName.UpdateDownload);
  const updateNonExistent = updateWindow == null || !updateWindow.isAlive();
  const switchingProduct = omsApp.status === OmsApplicationStatusEnum.SwitchingProduct;
  if ((isHome && loginNonExistent && updateNonExistent && !switchingProduct) || WindowManager.size() === 0) {
    windowPools.clearWindowPools();
    // WindowManager.closeAll();
    // omsApp.quit();
    beforeAppQuit();
  } else if (isHome && !loginNonExistent) {
    windowBoundsStorage.queueThen().then(() => {
      WindowManager.closeAll([WindowName.Login]);
    });
  } else {
    windowPools.clearUnAliveWindowPools();
    if (checkWindowPoolsByCloseTimer) clearTimeout(checkWindowPoolsByCloseTimer);
    checkWindowPoolsByCloseTimer = setTimeout(() => checkWindowPoolsByClose(win), 100);
  }
};

/** 设置行情看板页默认 onReadyShow 行为 */
const patchProductPanelOnReady = (config: BaseWindowProps) => {
  const { onReadyShow } = config;
  config.onReadyShow = win => {
    sendProductPanelChange();
    onReadyShow?.(win);
  };
};

/** 设置iquote悬浮卡片页默认 onReadyShow 行为 */
const patchIQuoteCardOnReady = (config: BaseWindowProps) => {
  const { onReadyShow } = config;
  config.onReadyShow = win => {
    sendIQuoteCardChange();
    onReadyShow?.(win);
  };
};

/**
 * 设置窗口的默认 onReadyShow 行为
 * 留个口子，方便将来做结构优化时拆分逻辑
 */
const patchWindowOnReady = (win: NormalWindow) => {
  if (win.name.startsWith(WindowName.ProductPanel)) {
    patchProductPanelOnReady(win);
  }

  if (win.name.startsWith(WindowName.IQuoteCard)) {
    patchIQuoteCardOnReady(win);
  }
};

/**
 * 注册窗口的基础事件
 * @param win 窗口对象
 */
const setWindowBasicEvent = (win: WindowInstance) => {
  win.object?.on('close', ev => !getRestartWindowFlag() && beforeWindowClose(win, ev));

  win.object?.on('closed', () => afterWindowClose(win, true));

  win.object?.on(
    'move',
    debounce(() => {
      judgeSetWindowBoundsCache(win);
      judgeLayoutForResized(win);
      updateUnMaximizedBounds(win);
    }, 200)
  );

  win.object?.on('resized', () => {
    judgeSetWindowBoundsCache(win);
    judgeLayoutForResized(win);
    updateUnMaximizedBounds(win);
  });

  win.object?.on('focus', () => {
    win.getContent()?.send(IPCEventEnum.WindowFocus, []);
    if (!isMac) changeWindowOnTopByFocus(win);
  });

  win.object?.on('blur', () => win.getContent()?.send(IPCEventEnum.WindowBlur, []));

  if (WindowManager.isInPool(win.name)) return;

  // win.getContent()?.on('did-finish-load', () => didFinishLoad(win));

  win.getContent()?.on('will-navigate', (_ev, _url) => {
    _ev.preventDefault();
  });

  win.object?.on('app-command', (_ev, _cmd) => {
    if (_cmd === 'browser-backward' || _cmd === 'browser-forward') {
      _ev.preventDefault();
    }
  });
};

/** 缓存当前窗口的参数、配置项信息 */
const setWindowParamsCache = (
  win: WindowInstance,
  options: BrowserWindowConstructorOptions = {},
  custom: CustomProps = { route: '' }
) => {
  if (!isObject(win)) return;
  win.options = options;
  win.custom = custom;
};

const handleAfterCreate = (win: WindowInstance, config: BaseWindowProps) => {
  setWindowParamsCache(win, config.options, config.custom);

  if (!!win.isAlive() && config.parentId !== win.getContent()?.id) {
    setWindowLevel(config.parentId || 0, config.options);
    win.parentId = config.parentId;
  }

  // if (win.category === WindowCategory.Basic && win.custom.filename !== 'index.html') {
  // WindowManager.focus(win.name);
  // }

  setWindowBasicEvent(win);
  monitorWindowError(win);
};

/**
 * 判断窗口是否达到同类型的数量上限
 * @param params CreateDialogParams 窗口基本配置
 * @returns string, 为空字符串代表没达到上限，否则返回提示语句
 */
const judgeWindowSizeLimit = (params: CreateDialogParams) => {
  if (!params.numberLimit) return '';
  if (params.name.startsWith(WindowName.ProductPanel)) {
    const windowLength = WindowManager.getWindowsByPrefix(WindowName.ProductPanel).length;
    if (windowLength >= params.numberLimit) {
      return '行情看板窗口数量已达上限！';
    }
  } else if (params.name.startsWith(WindowName.SingleBond)) {
    const windowLength = WindowManager.getWindowsByPrefix(WindowName.SingleBond).length;
    if (windowLength >= params.numberLimit) {
      return '债券详情窗口数量已达上限！';
    }
  } else if (params.name.startsWith(WindowName.IQuoteCard)) {
    const windowLength = WindowManager.getWindowsByPrefix(WindowName.IQuoteCard).length;
    if (windowLength >= params.numberLimit) {
      return '卡片组窗口数量已达上限！';
    }
  }
  return '';
};

/**
 * 创建窗口
 * @param config BaseWindowProps 窗口基本配置
 * @returns
 */
const createWindow = async <T>(config: BaseWindowProps) => {
  setWindowStartTime(Date.now());

  const { pageUrl, routeUrl } = buildPageUrl(config.custom);

  const prevWin = WindowManager.get(config.name);

  const isValidWindow = !WindowManager.isInPool(config.name);

  /** 若窗口已经存在，且处于活跃状态，则直接返回当前活跃的窗口 */
  if (prevWin?.isAlive() && isValidWindow) {
    // TODO: 下面的设置，应该放在外面（调用方）去操作，此函数理论上只负责创建并返回窗口
    if (prevWin.name.startsWith(WindowName.ProductPanel)) {
      sendProductPanelChange();
    }
    if (prevWin.name.startsWith(WindowName.IQuoteCard)) {
      sendIQuoteCardChange();
    }

    // TODO: 下面的设置，应该放在外面（调用方）去操作，此函数理论上只负责创建并返回窗口
    if (prevWin.isSpecial()) {
      if (prevWin.url !== pageUrl) {
        prevWin.setURL(pageUrl);
        prevWin.loadURL(pageUrl);
      }
      setWindowParamsCache(prevWin, config.options, config.custom);
      handleAfterWindowReady(prevWin);
    } else WindowManager.focus(config.name);
    return prevWin as unknown as T;
  }
  // 当为新创建窗口时检查窗口创建数量是否达到上限
  const hint = judgeWindowSizeLimit(config);
  if (hint) {
    config.reachLimit?.(hint);
    return null;
  }

  if (
    windowPools.getEffectiveNormalPoolsLen() &&
    config.category === WindowCategory.Normal &&
    config.custom?.route !== CommonRoute.PreparedWindow
  ) {
    const win = await windowPools.unshiftNormalWindow();
    if (!win) return null;
    win.resetAttribute({ ...config, name: win.name, category: win.category });

    if (config.name !== win.name) {
      const oldName = win.name;
      win.name = config.name;
      WindowManager.delete(oldName);
      WindowManager.add(win.name, win);
    }
    win.allowReady();
    // 切换导航
    win.getContent()?.postMessage(IPCEventEnum.NavigationWindow, { routeUrl, context: win?.custom?.context });

    handleAfterCreate(win, config);
    return win as unknown as T;
  }

  const win = WindowManager.create({ ...config, url: pageUrl });

  if (win?.constructor === NormalWindow && config.custom.route !== CommonRoute.PreparedWindow) {
    win.allowReady();
  }

  if (win && !WindowManager.isInPool(win.name)) handleAfterCreate(win, config);
  return win as unknown as T;
};

/** 主动调用窗口的onReadyShow事件 */
const triggerWindowReady = (win: WindowInstance) => {
  const { onReadyShow } = win;

  if (onReadyShow != null && typeof onReadyShow === 'function') {
    console.log(`${win.name}: ready-to-show - onReadyShow`);
    onReadyShow(win);
  }
};

/**
 * 创建默认的页面级Window（无边框、关闭、最大化、最小化）
 * @param config BaseWindowProps 窗口属性
 * @returns
 */
export const createRouterWindow = async <T>(config: BaseWindowProps) => {
  config.options = mergeConfig(FRAME_WINDOW_CONFIG.options || {}, config.options || {});
  config.options.webPreferences = {
    ...getDefaultWebPreferences(),
    ...config.options.webPreferences
  };

  config.custom = { ...DEFAULT_CUSTOM_WINDOW_PROPS, ...config.custom };

  if (config.defaultOpenDevTools === undefined) config.defaultOpenDevTools = FRAME_WINDOW_CONFIG.defaultOpenDevTools;

  const win = (await createWindow<T>(config)) as unknown as WindowInstance;

  if (win == null) return null;

  if (win.isSpecial() && win.isAlive() && !win.object?.isMinimized()) {
    await changeBoundsByParams(win);
    triggerWindowReady(win);
  } else {
    win.onReady(async (w: WindowInstance) => {
      const isNormal = w.isNormal();

      if (isNormal) {
        patchWindowOnReady(win as NormalWindow);
        // didFinishLoad(w);
      }
      await changeBoundsByParams(w);
      triggerWindowReady(w);
      windowReady(w);
      if (!w.isSpecial()) w.open();
    });
  }
  return win as unknown as T;
};

/** 防止因为个别原因，导致短时间内多次触发 init */
let prevInitNormalPools = 0;

/** 初始化普通窗口池 */
export const initNormalWindowPools = () => {
  const now = Date.now();
  if (now - prevInitNormalPools <= 500) return;

  prevInitNormalPools = now;

  const windowPoolsLen = windowPools.windowPoolsLen - windowPools.getNormalPoolsLen();
  const arr = new Array(windowPoolsLen).fill(0);

  arr.forEach(async () => {
    const win = await createRouterWindow<NormalWindow>({
      title: '空白页',
      name: uuidv4(),
      category: WindowCategory.Normal,
      custom: { route: CommonRoute.PreparedWindow, isFullScreen: false },
      // parentId,
      options: { paintWhenInitiallyHidden: false }
    });
    if (win != null) windowPools.setNormalWindow(win.name, win);
  });
};

const defaultProductType = ProductType.BNC.toString(); // 目前启动时默认的台子
/**
 * 获取单条报价的窗口配置
 * @param parentId number 父窗口webContents.id
 * @returns
 */
const getSingleQuoteConfig = (parentId?: number): BaseWindowProps => {
  return {
    parentId,
    ...SingleQuoteDialogConfig,
    custom: {
      ...SingleQuoteDialogConfig.custom,
      routePathParams: [defaultProductType]
    }
  };
};

/** 防止因为个别原因，导致短时间内多次触发 init */
let prevInitSpecialPools = 0;
/**
 * 初始化特殊窗口池
 * @param parentId number 父窗口webContents.id
 * @returns
 */
const initSpecialWindowPools = (parentId?: number) => {
  const now = Date.now();
  if (now - prevInitSpecialPools <= 500) return;

  prevInitSpecialPools = now;
  windowPools.clearSpecialPools();

  windowPools.specialPoolKeys.forEach(async key => {
    if (key === WindowName.SingleQuoteV2) {
      const config = getSingleQuoteConfig(parentId);
      const win = await createRouterWindow<SpecialWindow>(config);
      if (win != null) windowPools.setSpecialWindow(win.name, win);
    }
  });
};

/**
 * 创建loading窗口
 * @param params BaseWindowProps 窗口参数
 */
export const createLoadingWindow = (params?: BaseWindowProps) => {
  if (params != null) {
    const { onReadyShow } = params;
    params.onReadyShow = (win?: BaseWindow) => {
      WindowManager.get(WindowName.LoadingWindow)?.close();
      setShouldCloseLoading(true);
      if (onReadyShow != null && typeof onReadyShow === 'function') {
        onReadyShow?.(win);
      }
    };
  }

  return createRouterWindow({
    name: WindowName.LoadingWindow,
    category: WindowCategory.Basic,
    title: 'Loading',
    custom: { filename: 'loading.html', route: '' },
    options: {
      ...FRAME_WINDOW_CONFIG.options,
      skipTaskbar: true,
      width: 160,
      height: 100,
      resizable: false,
      webPreferences: getDefaultWebPreferences()
    }
  });
};

/**
 * 创建首页窗口
 * @param hasInit 是否已经初始化过了
 */
export const createHomeWindow = async (hasInit = true) => {
  const config = userInitConfigStorage.getUserInitConfig();

  const productType = config?.productType ?? ProductType.BNC;

  const routePathParams: string[] = [];

  if (productType) {
    routePathParams.push(productType.toString());
  }

  const home = await createRouterWindow<BasicWindow>({
    name: WindowName.MainHome,
    category: WindowCategory.Basic,
    title: '首页',
    custom: {
      isFirst: !hasInit,
      route: CommonRoute.Home,
      isFullScreen: true,
      routePathParams
    },
    onReadyShow: () => {
      WindowManager.get(WindowName.Login)?.close();
      setShouldCloseLoading(true);
      WindowManager.get(WindowName.LoadingWindow)?.close();
      WindowManager.get(WindowName.UpdateDownload)?.close();
    },
    options: {
      minWidth: DEFAULT_WINDOW_WIGHT,
      minHeight: DEFAULT_WINDOW_HEIGHT,
      resizable: true
    }
  });
  return home;
};

export const createLoginWindow = (param?: Partial<LoginCreateParam>, needCheckUpdate = true) => {
  const { showLoading = false, isFirst = false } = param ?? {};
  const config = {
    name: WindowName.Login,
    title: '登录',
    category: WindowCategory.Basic,
    options: { width: 800, height: 480, resizable: false },
    custom: { isFirst, route: CommonRoute.Login, urlParams: `needCheckUpdate=${needCheckUpdate}` },
    onReadyShow: () => {
      WindowManager.get(WindowName.LoadingWindow)?.close();
      setShouldCloseLoading(true);
    }
  };
  if (showLoading) {
    createLoadingWindow(config);
  }
  createRouterWindow(config);
};

export default {};
