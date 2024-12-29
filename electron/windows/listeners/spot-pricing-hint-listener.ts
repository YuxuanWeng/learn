import { LogContext } from '@fepkg/logger';
import { DealUnreadNotify } from '@fepkg/services/types/common';
import { NotifyType } from '@fepkg/services/types/enum';
import { SpotPricingHintClient } from 'app/packages/spot-pricing-hint-client';
import {
  SpotPricingHintClientConfig,
  SpotPricingHintEventAction,
  SpotPricingHintEventData
} from 'app/packages/spot-pricing-hint-client/types';
import { SpotPricingHintEnum, UtilEventEnum } from 'app/types/IPCEvents';
import { WindowCategory } from 'app/types/types';
import { WindowInstance } from 'app/types/window-type';
import { CommonRoute, WindowName } from 'app/types/window-v2';
import { getOnTopLevel } from 'app/utils/args';
import { getBoundsVisibleInDisplay } from 'app/utils/bounds-helper-v2';
import { createWebWorker } from 'app/utils/worker';
import { IpcMainEvent, IpcMainInvokeEvent, Size, ipcMain, powerMonitor, screen } from 'electron';
import { SpotPricingDisplayRecord } from '@/pages/Spot/SpotPricingHint/types';
import { printLog } from '../../utils/print-log';
import { isWin7 } from '../../utils/utools';
import { createRouterWindow } from '../app-windows';
import { WindowManager } from '../models/windows-manager';
import { postMessageAllWindow } from './broadcast-listener';
import { logToLocal } from './business-log-listener';

let isCreatingWindow = false;
let isVisible = false;
let curParentName = '';
let spotPricingHintScreenSize: Size | undefined;

const openSpotPricingHintWindow = async () => {
  if (isCreatingWindow) return;
  isCreatingWindow = true;
  const idcHome = WindowManager.get(WindowName.BNCIdcHome);
  const target = idcHome ?? WindowManager.get(WindowName.MainHome);
  const bounds = target?.getBounds();

  if (target?.object == null || !bounds) {
    isCreatingWindow = false;
    return;
  }

  curParentName = target.name;

  const targetDisplay = screen.getDisplayMatching(bounds);

  try {
    const win = await createRouterWindow<WindowInstance>({
      name: WindowName.SpotPricingHint,
      title: '点价提示',
      category: WindowCategory.Normal,
      custom: { route: CommonRoute.SpotPricingHint, isTop: true },
      options: {
        width: 1,
        height: 1,
        resizable: false,
        skipTaskbar: true,
        thickFrame: false,
        modal: false,
        transparent: true,
        hasShadow: false,
        backgroundColor: '#00000000',
        enableLargerThanScreen: true,
        frame: false,
        roundedCorners: false,
        x: targetDisplay.workArea.x + targetDisplay.workArea.width,
        y: targetDisplay.workArea.y + targetDisplay.workArea.height
      }
    });

    isVisible = false;

    spotPricingHintScreenSize = targetDisplay.workAreaSize;

    postMessageAllWindow(SpotPricingHintEnum.UpdateRendererSize, spotPricingHintScreenSize);
  } finally {
    isCreatingWindow = false;
  }
};

const setWindowBackground = () => {
  const win = WindowManager.get(WindowName.SpotPricingHint)?.object;

  win?.setBackgroundColor('#00FFFFFF');
};

const getScreenSize = () => {
  const win = WindowManager.get(WindowName.SpotPricingHint);
  const bounds = win?.getBounds();
  if (win?.object == null || !bounds) return null;

  const newScreenSize = screen.getDisplayMatching(bounds).workAreaSize;

  return newScreenSize;
};

const toogleClickThrough = (_e: IpcMainEvent, value: boolean) => {
  if (isWin7) return;

  const win = WindowManager.get(WindowName.SpotPricingHint)?.object;
  win?.setIgnoreMouseEvents(value, { forward: true });

  if (value) {
    if (win?.isFocused()) {
      win?.blur();
    }
    if (win?.isFocusable()) {
      win?.setFocusable(false);
    }
  }
};

const showErrorInparent = (_e: IpcMainEvent, error: string) => {
  const targetName = curParentName;

  const parent =
    WindowManager.get(targetName) ?? WindowManager.get(WindowName.BNCIdcHome) ?? WindowManager.get(WindowName.MainHome);

  if (parent != null) {
    parent.object?.webContents.postMessage(UtilEventEnum.MainProcessError, error);
  } else {
    postMessageAllWindow(UtilEventEnum.MainProcessError, error);
  }
};

const resizeWindow = (_e: IpcMainInvokeEvent, windowWidth: number, windowHeight: number, reChoseWindow = false) => {
  const win = WindowManager.get(WindowName.SpotPricingHint)?.object;
  const idcHome = WindowManager.get(WindowName.BNCIdcHome);
  const target = idcHome ?? WindowManager.get(WindowName.MainHome);
  const targetBounds = target?.getBounds();
  win?.setBackgroundColor('#00FFFFFF');

  if (win == null || target?.object == null || targetBounds == null) return;

  let localWindowHeight = windowHeight;
  if (windowHeight == -1) {
    localWindowHeight = screen.getDisplayMatching(win.getBounds()).workArea.height;
  }

  if (!win?.isFocusable()) {
    win?.setFocusable(true);
  }

  const setVisible = (val: boolean) => {
    win.setSkipTaskbar(!val);
    isVisible = val;
    setTimeout(() => {
      win.setSkipTaskbar(!val);
    }, 300);
  };

  const { width, height } = { width: windowWidth, height: localWindowHeight };

  const oldBounds = win.getBounds();

  let newBounds = {
    width,
    height,
    x: oldBounds.x - width + oldBounds.width,
    y: oldBounds.y - height + oldBounds.height
  };

  if (reChoseWindow || !screen.getAllDisplays().some(d => getBoundsVisibleInDisplay(newBounds, d))) {
    const targetDisplay = screen.getDisplayMatching(targetBounds);

    curParentName = target.name;

    newBounds = {
      width,
      height,
      x: targetDisplay.workArea.x + targetDisplay.workArea.width - width,
      y: targetDisplay.workArea.y + targetDisplay.workArea.height - height
    };

    win.setContentBounds(newBounds);

    if (width === 1 && height === 1) {
      setVisible(false);
      return;
    }

    if (!isVisible) {
      setVisible(true);
    }

    return;
  }

  if (oldBounds.width === width && oldBounds.height === height) return;

  win.setContentBounds(newBounds);

  if (width === 1 && height === 1) {
    setVisible(false);

    return;
  }

  if (!isVisible) {
    setVisible(true);
  }
};

const onMessage = async (recordList: SpotPricingDisplayRecord[], forceVisible = false) => {
  let spotPricingHintWindow = WindowManager.get(WindowName.SpotPricingHint);

  if (spotPricingHintWindow == null) {
    await openSpotPricingHintWindow();

    spotPricingHintWindow = WindowManager.get(WindowName.SpotPricingHint);
  }

  if (recordList.length === 0) return;
  spotPricingHintWindow?.object?.setFocusable(true);

  spotPricingHintWindow?.getContent()?.postMessage(SpotPricingHintEnum.NewMessage, { recordList, forceVisible });
  spotPricingHintWindow?.object?.setAlwaysOnTop(true, getOnTopLevel());
};

const handleWorkerMessageEvent = (evt: MessageEvent<SpotPricingHintEventData>) => {
  const { action, value } = evt.data;
  if (action === SpotPricingHintEventAction.NewHint) {
    onMessage(
      ((value ?? []) as DealUnreadNotify[]).map(d => ({
        ...d.spot_pricing_detail,
        isOffline: d.deal_notify_info.NotifyType === NotifyType.NotifyTypeOffline,
        isManualRefresh: false,
        forceVisible: false,
        receiverSide: d.deal_notify_info.receiver_side,
        dealID: d.deal_notify_info.notify_id
      }))
    );
  }

  if (action === SpotPricingHintEventAction.Log) {
    const logContext: LogContext[] = value;

    logContext.forEach(item => {
      printLog('SPOT_PRICING_HINT_WORKER:', item);

      logToLocal(item);
    });
  }
};

const newManualMessage = (_e: IpcMainEvent, recordList: SpotPricingDisplayRecord[]) => {
  onMessage(recordList, true);
};

let spotPricingHintClient: SpotPricingHintClient | undefined;

export const focusWindow = () => {
  const win = WindowManager.get(WindowName.SpotPricingHint)?.object;

  if (win?.isFocusable() === false) {
    win?.setFocusable(true);
  }

  if (win?.isFocused() === false) {
    win?.focus();
  }
};

export const startSpotPricingHintClientPolling = (config: SpotPricingHintClientConfig) => {
  openSpotPricingHintWindow();
  spotPricingHintClient?.startPolling(config);
};

export const endSpotPricingHintClientPolling = () => {
  spotPricingHintClient?.endPolling();
};

const updateToken = (_e: IpcMainEvent, token: string) => {
  spotPricingHintClient?.updateToken(token);
};

const start = () => {
  ipcMain.on(SpotPricingHintEnum.Focus, focusWindow);
  ipcMain.on(SpotPricingHintEnum.ToggleClickThrough, toogleClickThrough);
  ipcMain.on(SpotPricingHintEnum.ShowErrorInParent, showErrorInparent);
  ipcMain.on(SpotPricingHintEnum.NewManualMessage, newManualMessage);
  ipcMain.handle(SpotPricingHintEnum.Resize, resizeWindow);
  ipcMain.handle(SpotPricingHintEnum.GetScreenSize, getScreenSize);
  ipcMain.on(UtilEventEnum.UpdateToken, updateToken);

  const worker = createWebWorker(__dirname, 'spot-pricing-hint-worker.js');

  spotPricingHintClient = new SpotPricingHintClient(worker, handleWorkerMessageEvent);

  spotPricingHintClient.start();

  powerMonitor.addListener('resume', setWindowBackground);

  powerMonitor.addListener('unlock-screen', setWindowBackground);
};

const end = () => {
  ipcMain.off(SpotPricingHintEnum.Focus, focusWindow);
  ipcMain.off(SpotPricingHintEnum.ToggleClickThrough, toogleClickThrough);
  ipcMain.off(SpotPricingHintEnum.ShowErrorInParent, showErrorInparent);
  ipcMain.off(SpotPricingHintEnum.NewManualMessage, newManualMessage);
  ipcMain.off(SpotPricingHintEnum.Resize, resizeWindow);
  ipcMain.off(SpotPricingHintEnum.GetScreenSize, getScreenSize);
  ipcMain.off(UtilEventEnum.UpdateToken, updateToken);

  spotPricingHintClient?.end();
};

export default () => [start, end];
