import { LOGGER_URL, METRICS_URL } from '@fepkg/business/constants/upload-url';
import { AppEnv } from '@fepkg/common/types';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { User } from '@fepkg/services/types/common';
import * as Sentry from '@sentry/electron';
import { captureMessage } from '@sentry/electron';
import { OmsApplicationStatusEnum, omsApp } from 'app/models/oms-application';
import { UserInitConfig } from 'app/types/user-init-config';
import { WindowName } from 'app/types/window-v2';
import { isDevOrTest } from 'app/utils/electron-is-dev';
import { getAppConfig } from 'app/utils/get-app-config';
import { LAYOUT_VERSION, writeLayoutWindows } from 'app/utils/layouts';
import { logger, trackPoint } from 'app/utils/main-logger';
import { metrics } from 'app/utils/main-metrics';
import { localServerProcessEnd } from 'app/windows/listeners/local-server-listener';
import { IpcMainEvent, IpcMainInvokeEvent, ipcMain, powerMonitor, powerSaveBlocker } from 'electron';
import IPCEventEnum, { LoginEventEnum } from '../../types/IPCEvents';
import { createHomeWindow, createLoadingWindow, createLoginWindow } from '../app-windows';
import { WindowManager } from '../models/windows-manager';
import { clearNormalPools, clearSpecialPools } from '../pools/windows-pool';
import { UserInitConfigStorageMeta, userInitConfigStorage } from '../store/user-init-config-storage';
import { WindowOpenedStorageStatusEnum, windowOpenedStorage } from '../store/window-opened-storage';
import { windowBoundsStorage } from '../store/window-size-storage';
import { getApiHost } from '../utils';
import { postMessageAllWindow } from './broadcast-listener';
import { initElectronLogDaily } from './business-log-listener';
import {
  handleDataLocalizationEnd,
  handleDataLocalizationStart,
  restDataLocalization
} from './data-localization-listener';
import { startIMHelper, stopIMHelperListening } from './im-helper-listener';
import { setShouldCloseLoading } from './loading-listener';
import { endSpotPricingHintClientPolling, startSpotPricingHintClientPolling } from './spot-pricing-hint-listener';
import { getDeviceId, softLifecycleId } from './util-listener';

let powerSaveBlockerID: number | undefined;
let nextAutoLogoutTime: Date | undefined;
let autoLogoutTimer: NodeJS.Timeout | undefined;

const changeMeta = (_e: IpcMainEvent, meta?: UserInitConfigStorageMeta) => {
  if (meta) {
    metrics.setMeta({ ...meta, uploadUrl: meta.metricsUrl });
    logger.setMeta({ ...meta, uploadUrl: meta.logUrl });
  }
};

const stopBlocker = () => {
  if (powerSaveBlockerID != null) {
    powerSaveBlocker.stop(powerSaveBlockerID);

    powerSaveBlockerID = undefined;
  }
};

const clearAutoLogoutTimer = () => {
  if (autoLogoutTimer != null) {
    clearInterval(autoLogoutTimer);

    autoLogoutTimer = undefined;
  }

  nextAutoLogoutTime = undefined;
};

// 每日自动登出的时间
const AUTO_LOGOUT_HOUR = 2;
const AUTO_LOGOUT_MINUTE = 0;
const AUTO_LOGOUT_SECOND = 0;
const AUTO_LOGOUT_CHECK_SPAN = 10 * 60 * 1000;

const checkTimeAndAutoLogout = async () => {
  const now = new Date();

  if (nextAutoLogoutTime != null && now.getTime() > nextAutoLogoutTime.getTime()) {
    await writeLayoutWindows();
    omsApp.setAppStatus(OmsApplicationStatusEnum.AutoLogout);
    postMessageAllWindow(LoginEventEnum.AutoLogout, WindowName.MainHome);
  }
};

const setAutoLogoutTimer = (
  hours = AUTO_LOGOUT_HOUR,
  minutes = AUTO_LOGOUT_MINUTE,
  seconds = AUTO_LOGOUT_SECOND,
  checkSpan = AUTO_LOGOUT_CHECK_SPAN
) => {
  const now = new Date();

  let logoutTime = new Date();

  logoutTime.setHours(hours);
  logoutTime.setMinutes(minutes);
  logoutTime.setSeconds(seconds);

  if (logoutTime.getTime() < now.getTime()) {
    logoutTime = new Date(logoutTime.getTime() + 24 * 3600 * 1000);
  }

  nextAutoLogoutTime = logoutTime;

  autoLogoutTimer = setInterval(checkTimeAndAutoLogout, checkSpan);
};

/** 设置自动退登 */
const resetAutoLogoutTimer = (
  _event: IpcMainInvokeEvent,
  hours = AUTO_LOGOUT_HOUR,
  minutes = AUTO_LOGOUT_MINUTE,
  seconds = AUTO_LOGOUT_SECOND,
  checkSpan = AUTO_LOGOUT_CHECK_SPAN
) => {
  if (autoLogoutTimer) {
    clearInterval(autoLogoutTimer);
  }
  setAutoLogoutTimer(hours, minutes, seconds, checkSpan);
};

/** 将自动退登重置为默认状态 */
const resettingAutoLogoutTimer = () => {
  if (autoLogoutTimer) {
    clearInterval(autoLogoutTimer);
  }
  setAutoLogoutTimer();
};

const beforeLogin = () => omsApp.setAppStatus(OmsApplicationStatusEnum.Logging);

const loginError = () => omsApp.setAppStatus(OmsApplicationStatusEnum.LoginWindowReady);

const userLogout = () => omsApp.setAppStatus(OmsApplicationStatusEnum.UserLogout);

const { version } = getAppConfig();

const onLogin = (_e: IpcMainInvokeEvent, loginData: UserInitConfig) => {
  Sentry.setTag('apiEnv', loginData.env);
  Sentry.setTag('userId', loginData.userInfo.user_id);
  Sentry.setUser(loginData.userInfo);

  userInitConfigStorage.setUserInitConfig({
    ...loginData,
    logUrl: `${getApiHost(loginData.env)}${LOGGER_URL}`,
    metricsUrl: `${getApiHost(loginData.env)}${METRICS_URL}`
  });

  windowOpenedStorage.setStatus(WindowOpenedStorageStatusEnum.Initialized);

  const meta = userInitConfigStorage.getMeta();
  if (meta) {
    metrics.setMeta({ ...meta, uploadUrl: meta.metricsUrl });
    logger.setMeta({ ...meta, uploadUrl: meta.logUrl });
  }
};

const afterLogin = (
  _e: IpcMainInvokeEvent,
  loginData: {
    token: string;
    baseURL: string;
    authBaseURL: string;
    algoBaseURL: string;
    userInfo: User;
    env: string;
    isReLoginAfterResetPassword?: boolean;
    websocketHost?: string;
    deviceType: string;
    productType: ProductType;
  }
) => {
  const { isReLoginAfterResetPassword } = loginData;

  const loginWindow = WindowManager.get(WindowName.Login);
  if (loginWindow == null && !isReLoginAfterResetPassword) return;

  if (!isReLoginAfterResetPassword) {
    createHomeWindow();

    initElectronLogDaily(); // 本地日志配置每日初始化
    stopBlocker();
    clearAutoLogoutTimer();

    powerSaveBlockerID = powerSaveBlocker.start('prevent-app-suspension');
    setAutoLogoutTimer();
  }

  startSpotPricingHintClientPolling({
    token: loginData.token,
    requestBaseURL: loginData.baseURL,
    // version: omsApp.appConfig.version,
    version,
    deviceId: getDeviceId(),
    platform: process.platform === 'darwin' ? 'MAC' : 'WINDOWS',
    softLifecycleId,
    deviceType: loginData.deviceType,
    apiEnv: loginData.env as AppEnv,
    userInfo: loginData.userInfo,
    // uploadUrl: omsApp.appConfig?.logURL ?? ''
    uploadUrl: `${getApiHost(loginData.env as AppEnv)}${LOGGER_URL}`,
    productType: loginData.productType
  });

  startIMHelper({
    token: loginData.token,
    requestBaseURL: loginData.baseURL,
    authBaseURL: loginData.authBaseURL,
    algoBaseURL: loginData.algoBaseURL,
    // version: omsApp.appConfig.version,
    version,
    deviceId: getDeviceId(),
    platform: process.platform === 'darwin' ? 'MAC' : 'WINDOWS',
    userInfo: loginData.userInfo,
    env: loginData.env,
    websocketHost: loginData.websocketHost,
    productType: loginData.productType
  });
};

export const afterLoginHandler = (restartLogin = true) => {
  if (WindowManager.get(WindowName.Login) != null) return;
  WindowManager.get(WindowName.LoadingWindow)?.close();
  setShouldCloseLoading(true);

  if (restartLogin) createLoginWindow();

  /** 关闭local-server进程 */
  localServerProcessEnd();
  handleDataLocalizationEnd();
  WindowManager.get(WindowName.MainHome)?.close();
  clearNormalPools();
  clearSpecialPools();

  stopBlocker();
  clearAutoLogoutTimer();
  endSpotPricingHintClientPolling();
  stopIMHelperListening();
  setTimeout(() => {
    windowBoundsStorage.queueThen().then(() => userInitConfigStorage.removeUserInitConfig());
  }, 1200);
};

const afterLogout = (_e: IpcMainInvokeEvent, restartLogin = true) => {
  afterLoginHandler(restartLogin);
};

export const beforeLogoutHandler = () => {
  omsApp.setAppStatus(OmsApplicationStatusEnum.BeforeLogout);
  endSpotPricingHintClientPolling();
  stopIMHelperListening();
};

const beforeLogout = (_e: IpcMainInvokeEvent, text: string, title: string, okText: string) => {
  const windows = WindowManager.getAll();
  if (windows && windows.some(w => w.isHome())) {
    for (const window of windows) {
      if (
        window.isHome() &&
        omsApp.status !== OmsApplicationStatusEnum.UserLogout &&
        omsApp.status !== OmsApplicationStatusEnum.UserCloseHome
      ) {
        window?.getContent()?.send(LoginEventEnum.RendererBeforeLogout, text, title, okText);
      } else if (window.name !== WindowName.Login) {
        window?.close();
      }
    }
  }
  beforeLogoutHandler();
  return true;
};

const switchProductType = async (_event: IpcMainInvokeEvent, productType: ProductType) => {
  const omsStatus = omsApp.status;

  omsApp.setAppStatus(OmsApplicationStatusEnum.SwitchingProduct);
  const userConfig = userInitConfigStorage.getUserInitConfig();
  const userId = userConfig?.userInfo?.user_id;

  try {
    setShouldCloseLoading(true);

    const oldWindows = WindowManager.getAll();

    await createLoadingWindow();

    for (const win of oldWindows) win.close();

    await windowOpenedStorage.clear(LAYOUT_VERSION, userId);
    // await windowBoundsStorage.clear();

    const clearLocalizationRes = await restDataLocalization();
    if (!clearLocalizationRes) trackPoint('clearLocalization error!');

    // 阻断 + 判断home是否已经关闭
    await new Promise(resolve => {
      const timer = setInterval(() => {
        const home = WindowManager.get(WindowName.MainHome);
        if (!home?.isAlive()) {
          clearInterval(timer);
          resolve(true);
        }
      }, 100);
    });

    clearNormalPools();
    clearSpecialPools();

    if (userConfig) {
      userInitConfigStorage.setUserInitConfig({
        ...userConfig,
        productType
      });

      startSpotPricingHintClientPolling({
        token: userConfig.token,
        requestBaseURL: userConfig.baseURL,
        // version: omsApp.appConfig.version,
        version,
        deviceId: getDeviceId(),
        platform: process.platform === 'darwin' ? 'MAC' : 'WINDOWS',
        softLifecycleId,
        deviceType: userConfig.deviceType,
        apiEnv: userConfig.env as AppEnv,
        userInfo: userConfig.userInfo,
        // uploadUrl: omsApp.appConfig?.logURL ?? ''
        uploadUrl: `${getApiHost(userConfig.env as AppEnv)}${LOGGER_URL}`,
        productType
      });

      startIMHelper({
        token: userConfig.token,
        requestBaseURL: userConfig.baseURL,
        authBaseURL: userConfig.authBaseURL,
        algoBaseURL: userConfig.algoBaseURL,
        // version: omsApp.appConfig.version,
        version,
        deviceId: getDeviceId(),
        platform: process.platform === 'darwin' ? 'MAC' : 'WINDOWS',
        userInfo: userConfig.userInfo,
        env: userConfig.env,
        websocketHost: userConfig.websocketHost,
        productType
      });
    }
  } catch {
    captureMessage('main process: switchProductType error!');
  } finally {
    setTimeout(() => {
      handleDataLocalizationStart();
      createHomeWindow();

      omsApp.setAppStatus(omsStatus);
      /**
       * delay - 360:
       * 首页的关闭事件（afterWindowClose、beforeWindowClose）中有一些动作，如果不延迟，会导致首页的一些事件无法触发
       * 如发送给前端的 IPCEventEnum.BeforeWindowClose 事件
       * 或保存窗口位置信息的 windowBoundsStorage.queueThen()
       * 或保存窗口布局的 windowOpenedStorage.queueThen()
       * 尤其是windowBoundsStorage、windowOpenedStorage，首页关闭后还会有一些异步的文件保存操作，如果不延迟可能会导致再次启动时保存的信息不正确
       *  */
    }, 360);
  }
};

const start = () => {
  ipcMain.handle(LoginEventEnum.BeforeLogin, beforeLogin);
  ipcMain.handle(LoginEventEnum.LoginError, loginError);
  ipcMain.handle(LoginEventEnum.OnLogin, onLogin);
  ipcMain.handle(LoginEventEnum.AfterLogin, afterLogin);
  ipcMain.handle(LoginEventEnum.AfterLogout, afterLogout);
  ipcMain.handle(LoginEventEnum.BeforeLogout, beforeLogout);
  ipcMain.handle(LoginEventEnum.UserLogout, userLogout);
  ipcMain.on(LoginEventEnum.ChangeMeta, changeMeta);
  ipcMain.handle(IPCEventEnum.SwitchProductType, switchProductType);

  powerMonitor.addListener('resume', checkTimeAndAutoLogout);

  powerMonitor.addListener('unlock-screen', checkTimeAndAutoLogout);

  if (isDevOrTest()) {
    ipcMain.handle(IPCEventEnum.ResetAutoLogoutTimer, resetAutoLogoutTimer);
    ipcMain.handle(IPCEventEnum.ResettingAutoLogoutTimer, resettingAutoLogoutTimer);
  }
};

const end = () => {
  ipcMain.off(LoginEventEnum.BeforeLogin, beforeLogin);
  ipcMain.off(LoginEventEnum.LoginError, loginError);
  ipcMain.off(LoginEventEnum.OnLogin, onLogin);
  ipcMain.off(LoginEventEnum.AfterLogin, afterLogin);
  ipcMain.off(LoginEventEnum.AfterLogout, afterLogout);
  ipcMain.off(LoginEventEnum.BeforeLogout, beforeLogout);
  ipcMain.off(LoginEventEnum.UserLogout, userLogout);
  ipcMain.off(LoginEventEnum.ChangeMeta, changeMeta);
  ipcMain.off(IPCEventEnum.SwitchProductType, switchProductType);

  powerMonitor.removeListener('resume', checkTimeAndAutoLogout);
  powerMonitor.removeListener('unlock-screen', checkTimeAndAutoLogout);

  ipcMain.off(IPCEventEnum.ResetAutoLogoutTimer, resetAutoLogoutTimer);
  ipcMain.off(IPCEventEnum.ResettingAutoLogoutTimer, resettingAutoLogoutTimer);
};

/**
 * 登录相关Listener
 * 登录页面进出窗口调整
 */
export default () => [start, end];
