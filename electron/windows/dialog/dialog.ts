import { WindowCategory } from 'app/types/types';
import { Rectangle, dialog, screen } from 'electron';
import { checkIsProductPanel } from '@packages/utils';
import { omsApp } from '../../models/oms-application';
import { BusEventEnum } from '../../types/bus-events';
import { DialogCacheModule, DialogResponseType, DialogWindowResponse } from '../../types/dialog-v2';
import { WindowInstance } from '../../types/window-type';
import { WindowName } from '../../types/window-v2';
import { isMac, isWin7 } from '../../utils/utools';
import { createRouterWindow } from '../app-windows';
import { DEFAULT_WINDOW_HEIGHT, DEFAULT_WINDOW_WIGHT } from '../constants';
import { BaseWindowProps, CreateDialogParams } from '../models/base';
import { WindowManager } from '../models/windows-manager';
import { hasInSpecialPools } from '../pools/windows-pool';
import { dialogCacheMap, getChildDialogCache, getDialogCache, removeDialogCache, setDialogCache } from './context';
import { getIQuoteCardWindowName } from './iquote-card';
import { resetDialogPort } from './message-channel';

const getPrevDialogCache = (winContentsId: number, name: string, parentId?: number) => {
  const cache = getDialogCache(winContentsId);
  const hasCache = cache && cache.webContentsId === winContentsId && cache.parentId === parentId;
  const module: DialogCacheModule = hasCache ? cache : { winName: name, webContentsId: winContentsId, parentId };
  return module;
};

type updateDialogContextProps = {
  context?: unknown;
  name: string;
  winContentsId: number;
  parentId?: number;
  oldContentsId?: number;
};

const resetDialogContext = (
  params: updateDialogContextProps,
  resolve?: (response: DialogWindowResponse) => void,
  reject?: (reason?: unknown) => void
) => {
  const { winContentsId, context, name, parentId } = params;
  const module = { ...getPrevDialogCache(winContentsId, name, parentId), context, resolve, reject };
  setDialogCache(module as DialogCacheModule);
};

const updateDialogContext = (params: updateDialogContextProps) => {
  const { winContentsId, context, parentId, name, oldContentsId = 0 } = params;
  const module: DialogCacheModule = {
    ...getPrevDialogCache(oldContentsId, name, parentId),
    webContentsId: winContentsId,
    context
  };
  removeDialogCache(oldContentsId);
  setDialogCache(module);
};

/** 获取最近创建的非全屏的行情面板，不考虑重开程序布局恢复的场景 */
const getLatestProductPanel = () => {
  const cacheList = [...dialogCacheMap];
  for (let i = cacheList.length - 1; i >= 0; i--) {
    const [webContentsId, cache] = cacheList[i];
    if (!checkIsProductPanel(cache.winName)) continue;

    const productPanel = WindowManager.getByContentsId(webContentsId);
    if (!productPanel) continue;

    if (productPanel.options.fullscreen) continue;

    return productPanel;
  }
  return undefined;
};

/** 获取最近创建的非全屏的iquote卡片，不考虑重开程序布局恢复的场景 */
const getLatestIQuoteCard = () => {
  const cacheList = [...dialogCacheMap];
  for (let i = cacheList.length - 1; i >= 0; i--) {
    const [webContentsId, cache] = cacheList[i];
    if (!cache.winName?.startsWith(WindowName.IQuoteCard)) continue;

    const iquoteCard = WindowManager.getByContentsId(webContentsId);
    if (!iquoteCard) continue;

    if (iquoteCard.options.fullscreen) continue;

    return iquoteCard;
  }
  return undefined;
};

const buildMultiWindowlParams = (
  params: CreateDialogParams,
  getPrevWindow: () => WindowInstance | undefined,
  size: { width: number; height: number }
) => {
  const { options } = params;
  if (!options) return params;

  if (WindowManager.get(params.name)?.isAlive()) return params;
  options.width = size.width;
  options.height = size.height;
  if (options.center == null) {
    options.center = true;
  }

  /** 获取已创建的最近仍存活且非全屏的行情面板窗口位置, 新创建窗口位置增加一些offset避免新窗口都堆叠在同一位置 */
  const prevWindow = getPrevWindow();
  if (!prevWindow || prevWindow.isMaximized()) return params;

  const bounds = prevWindow.getBounds();
  if (!bounds) return params;

  options.width = bounds.width;
  options.height = bounds.height;
  const offset = 40;

  const currDisplay = screen.getDisplayMatching(bounds);
  if (!currDisplay) return params;

  /** 打开新行情看板时增正常加偏移的两种case:
   * 1. 打开新窗口并增加偏移后，当前屏幕仍能容纳该窗口
   * 2. 极端场景，最近打开的行情看板较大，加上偏移量后会比当前屏幕还要大，这种情况下为了防止重叠，仍然继续增加偏移创建新窗口，但若偏移量超出当前屏幕太多也不会继续偏移
   * 否则，新窗口展示在屏幕中心
   */
  const oversize =
    bounds.width + offset > currDisplay.bounds.width || bounds.height + offset > currDisplay.bounds.height;
  const offsetTooMuch =
    bounds.x + Math.floor(bounds.width / 2) + offset > currDisplay.bounds.x + currDisplay.bounds.width ||
    bounds.y + Math.floor(bounds.height / 2) + offset > currDisplay.bounds.y + currDisplay.bounds.height;
  if (
    (oversize && !offsetTooMuch) ||
    (bounds.width + bounds.x + offset <= currDisplay.bounds.x + currDisplay.bounds.width &&
      bounds.height + bounds.y + offset <= currDisplay.bounds.y + currDisplay.bounds.height)
  ) {
    options.x = bounds.x + offset;
    options.y = bounds.y + offset;
    options.center = false;
  } else {
    options.center = true;
  }

  return params;
};

/** 构建行情看板参数，需要根据当前首页状态动态计算bounds信息 */
const buildProductPanelParams = (params: CreateDialogParams) => {
  if (params.name !== WindowName.ProductPanel) return params;

  const { custom, options, parentId } = params;
  const [productType, groupId] = custom?.routePathParams ?? [];
  if (!custom || !options || !productType || !groupId || !parentId) return params;
  options.minWidth = DEFAULT_WINDOW_WIGHT;
  options.minHeight = DEFAULT_WINDOW_HEIGHT;

  params.name = `${params.name}__${groupId}`;
  return buildMultiWindowlParams(params, getLatestProductPanel, { width: 1440, height: 720 });
};

/** 构建iquote卡片参数，需要根据当前首页状态动态计算bounds信息 */
const buildIQuoteCardParams = (params: CreateDialogParams) => {
  if (params.name !== WindowName.IQuoteCard) return params;

  const { custom, options, parentId } = params;
  const [productType] = custom?.routePathParams ?? [];
  const { roomId } = custom.context as any;
  if (!custom || !options || !productType || !roomId || !parentId) return params;

  params.name = getIQuoteCardWindowName(roomId);
  return buildMultiWindowlParams(params, getLatestIQuoteCard, { width: 448, height: 490 });
};

/**
 * 创建窗口，除基础窗口（loading、login、第一个首页等），其他业务窗口几乎都通过此函数创建
 * @param params CreateDialogParams 窗口属性
 * @param resolve promise成功回调
 * @param reject promise错误回调
 * @param isRecovery 是否是在恢复某窗口
 * @param oldContentsId 旧的contentsId，一般来源于窗口崩溃前的窗口id
 * @returns Promise<WindowInstance | null
 */
export const createDialog = async (
  params: CreateDialogParams,
  resolve?: (value: DialogWindowResponse | PromiseLike<DialogWindowResponse>) => void,
  reject?: (reason?: unknown) => void,
  isRecovery = false,
  oldContentsId?: number
): Promise<WindowInstance | null> => {
  params = buildProductPanelParams(params);
  params = buildIQuoteCardParams(params);
  const { custom, name, parentId, instantMessaging = false } = params;
  const context = custom?.context;
  params.reachLimit = hint => {
    resolve?.({ type: DialogResponseType.Error, data: hint });
  };
  const win = await createRouterWindow<WindowInstance>(params);
  if (!win) {
    if (resolve) {
      resolve({ type: DialogResponseType.Error, data: '窗口创建失败，请稍后重试' });
    } else {
      dialog.showMessageBox({
        title: '系统提示',
        message: '窗口创建失败，请稍后重试..',
        type: 'error'
      });
    }
    return null;
  }

  // 如果已经创建过，则不添加缓存
  const winContentsId = win?.getContent()?.id || 0;
  const dialogContextParams = { winContentsId, context, name, parentId, oldContentsId };

  if (isRecovery) updateDialogContext(dialogContextParams);
  else resetDialogContext(dialogContextParams, resolve, reject);

  // 最后执行，否则拿到缓存的数据是上一次的
  resetDialogPort(winContentsId, instantMessaging);
  if (win?.name && hasInSpecialPools(win.name)) {
    WindowManager.focus(win.name);
  }
  if (!isMac && win?.custom?.isTop && !isWin7) {
    // TODO: 既然win7会有白屏问题，个别机型的窗口池窗口打开闪烁问题是否跟moveTop有关？
    win.object?.moveTop();
  }
  return win;
};

const BASIC_WINDOWS = new Set<string>();
const SPECIAL_WINDOWS = new Set<string>();

/**
 * 获取当前窗口的类型
 * @param params 窗口属性
 * @returns
 */
const getWindowCategory = (params: Partial<BaseWindowProps>) => {
  if (!params?.name) return WindowCategory.Normal;
  if (BASIC_WINDOWS.has(params.name)) return WindowCategory.Basic;
  if (SPECIAL_WINDOWS.has(params.name)) return WindowCategory.Special;
  return WindowCategory.Normal;
};

/**
 * 创建窗口
 * @param params 窗口属性
 * @returns
 */
export const createDialogWindow = (params: Omit<CreateDialogParams, 'category'>) => {
  return new Promise<DialogWindowResponse>((resolve, reject) => {
    createDialog({ ...params, category: getWindowCategory(params) }, resolve, reject);
  });
};

/**
 * 崩溃时关闭其子窗口
 * @param webContentsId 当前奔溃窗口的webContentsId
 */
const closeChildByCrash = (webContentsId: number) => {
  const childCaches = getChildDialogCache(webContentsId);
  for (const item of childCaches) {
    const win = WindowManager.getByContentsId(item.webContentsId);
    if (win) win.close();
  }
};

/**
 * 恢复单个窗口
 * @param params 窗口属性
 * @param lastRestartTimestamp 最近一次重启时间
 * @param webContentsId webContentsId
 */
export const recoveryDialogWindow = async (
  params: BaseWindowProps,
  lastRestartTimestamp: number,
  webContentsId: number | undefined
) => {
  if (webContentsId) closeChildByCrash(webContentsId);
  const win = await createDialog(params, undefined, undefined, true, webContentsId);
  if (win) win.lastRestartTimestamp = lastRestartTimestamp;
  omsApp.event.emit(BusEventEnum.RecoveryCancelFlag);
};
