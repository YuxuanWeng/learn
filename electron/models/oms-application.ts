/* eslint-disable class-methods-use-this */
import { app } from 'electron';
import { EventEmitter } from 'events';
import { AppConfig } from '../types/app-config';
import { WindowName } from '../types/window-v2';
import { getAppConfig } from '../utils/get-app-config';

export enum OmsApplicationStatusEnum {
  /** 初始值 */
  Initial = 0,
  /** 创建之前 */
  BeforeCreate = 1,
  /** 创建中 */
  Creating = 2,
  /** 创建完成 */
  Created = 3,
  /** 初始化 */
  BeforeInitialize = 4,
  /** 初始化中 */
  Initializing = 5,
  /** 完成初始化 */
  Initialized = 6,
  /** ready */
  Ready = 7,

  /** 切换台子 */
  SwitchingProduct = 8,

  // -- 窗口相关 start --
  LoginWindowReady = 10,
  UpdateWindowReady = 11,
  MainWindowReady = 12,
  // -- 窗口相关 end --

  // -- 登录状态 start --
  /** 正在登录 */
  Logging = 1001,
  /** 已登录 */
  Logged = 1002,
  /** 用户主动退出登录 */
  UserLogout = 1003,
  /** 退出登录 */
  BeforeLogout = 1004,
  /** 自动退登 */
  AutoLogout = 1005,
  // -- 登录状态 end --

  /** 用户主动关闭首页（关闭系统） */
  UserCloseHome = 21,
  /** 退出之前 */
  BeforeQuit = 22,
  /** 即将退出 */
  WillQuit = 23,
  /** 已退出 */
  Quit = 24,
  /** 更新系统 */
  BeforeUpdate = 25
}

// const event = new EventEmitter();

class OmsApplication {
  /** 工程名称 */
  name = 'OMS';

  /** 当前状态 */
  status: OmsApplicationStatusEnum = OmsApplicationStatusEnum.Initial;

  /** 启动时间 - 默认值：0 */
  startTime = 0;

  /** 程序ready时间 - 默认值：0 */
  readyTime = 0;

  appConfig: AppConfig;

  public event = new EventEmitter();

  constructor() {
    this.startTime = Date.now();
    this.status = OmsApplicationStatusEnum.BeforeCreate;
    this.appConfig = getAppConfig();

    // this.initAppEnv();
  }

  /** TODO：考虑是否将运行时的process.env进行抽象和规范化
   * 暂时注释，半成品
   */
  // private initAppEnv = () => {
  //   const { env } = process;

  //   const options = {
  //     // env: 'prod',
  //     serverScope: '',
  //     type: 'application',
  //     homeDir: app.getAppPath(),
  //     appName: app.getName(),
  //     userHome: app.getPath('home'),
  //     appData: app.getPath('appData'),
  //     appUserData: app.getPath('userData'),
  //     appVersion: app.getVersion(),
  //     isPackaged: app.isPackaged,
  //     execDir: app.getAppPath(),
  //     isEncrypted: false
  //   };

  //   // 规范化 env
  //   // env.NODE_ENV = options.env;
  //   env.EE_HOME = options.homeDir;
  //   // env.EE_SERVER_ENV = options.env;
  //   env.EE_SERVER_SCOPE = options.serverScope;
  //   env.EE_USER_HOME = options.userHome;
  //   env.EE_APP_DATA = options.appData;
  //   env.EE_APP_USER_DATA = options.appUserData;
  //   env.EE_EXEC_DIR = options.execDir;
  // };

  private basicEvent() {
    app.on('window-all-closed', () => {
      this.quit();
    });
    app.on(
      'second-instance',
      (_event: Electron.Event, _argv: string[], _workingDirectory: string, _additionalData: unknown) => {}
    );
    this.onReady(() => {
      this.readyTime = Date.now();
      this.setAppStatus(OmsApplicationStatusEnum.Ready);
    });
    app.on('before-quit', () => {
      this.setAppStatus(OmsApplicationStatusEnum.BeforeQuit);
    });
    app.on('will-quit', () => {
      this.setAppStatus(OmsApplicationStatusEnum.WillQuit);
    });
  }

  /** 开启单例模式 */
  private gotTheLock() {
    if (!app.requestSingleInstanceLock()) {
      this.quit();
    }
  }

  initialize() {
    /** 解决窗口hide后再show时的闪屏问题 */
    app.commandLine.appendSwitch('wm-window-animations-disabled');
    this.basicEvent();
    this.gotTheLock();
  }

  // -- 生命周期钩子 start --
  public setAppStatus(status: OmsApplicationStatusEnum) {
    this.status = status;
  }

  /** 第二个应用实例被创建时，当前应用实例接收的回调 */
  public onSecondInstance(fn: () => void) {
    app.on('second-instance', fn);
  }

  /**
   * mac独有事件，当应用被激活时触发
   * oms工程初始化激活不需要触发，统一在 whenReady后注册
   */
  public onActivate(fn: () => void) {
    app.whenReady().then(() => {
      app.on('activate', fn);
    });
  }

  public onReady(fn: () => void) {
    app.whenReady().then(fn);
  }

  public onBeforeQuit(fn: (event?: Electron.Event) => void) {
    app.on('before-quit', fn);
  }
  // -- 生命周期钩子 end --

  quit() {
    app.quit();
  }
}

export const omsApp = new OmsApplication();

export const resetAppStatusByReady = (name: string) => {
  if (name === WindowName.Login) {
    omsApp.setAppStatus(OmsApplicationStatusEnum.LoginWindowReady);
  } else if (name === WindowName.MainHome) {
    omsApp.setAppStatus(OmsApplicationStatusEnum.MainWindowReady);
  } else if (name === WindowName.UpdateDownload) {
    omsApp.setAppStatus(OmsApplicationStatusEnum.UpdateWindowReady);
  }
};
