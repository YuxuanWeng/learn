/**
 * 模拟一个崩溃：process.crash()
 */
import { captureMessage } from '@sentry/electron';
import IPCEventEnum from 'app/types/IPCEvents';
import { BusEventEnum } from 'app/types/bus-events';
import { WindowInstance } from 'app/types/window-type';
import { WindowCrashedEnum, WindowName } from 'app/types/window-v2';
import { UtilityProcessServiceNameEnum } from 'app/utility-process/utility-types';
import { printLog } from 'app/utils/print-log';
import { getLogoByNativeImage } from 'app/utils/utools';
import { IpcMainEvent, app, dialog, ipcMain } from 'electron';
import { omsApp } from '../../models/oms-application';
import { isProd } from '../../utils/electron-is-dev';
import { WindowManager } from '../models/windows-manager';
import { isHomeOrProductPanel } from '../windows-tools';
import { postMessageAllWindow } from './broadcast-listener';
import { localizationProcessGone } from './data-localization-listener';

const afterLogoutFromAppRestart = () => {
  app.relaunch();
  omsApp.quit();
};

const appRestart = () => {
  WindowManager.get(WindowName.MainHome)?.getContent()?.postMessage(IPCEventEnum.appRestart, true);
  /** 如果4s后还没有走完退登重启，则强制使用 app.quit 退出 */
  setTimeout(() => {
    omsApp.quit();
  }, 4000);
};

let restartWindowFlag = false;

export const getRestartWindowFlag = () => restartWindowFlag;

/**
 * 重启某个窗口
 * @param win WindowInstance 窗口实例
 */
export const restartWindow = (win: WindowInstance | null) => {
  if (!win) return;
  const contentsId = win.getContent()?.id;
  win?.close();

  const { custom, options } = win;
  const windowProps = win.getSelfProps();

  /** 关闭后会有时机问题，close 是异步的，延迟去重启 */
  setTimeout(() => {
    if (custom && options) {
      omsApp.event.emit(BusEventEnum.RecoveryDialog, { custom, options, ...windowProps }, Date.now(), contentsId);
    }
    omsApp.event.once(BusEventEnum.RecoveryCancelFlag, () => {
      restartWindowFlag = false;
    });
  }, 1000);
};

let beforeRestartTimer: NodeJS.Timeout | null = null;

/**
 * 窗口重启前的回调函数
 * @param win WindowInstance 窗口实例
 * @param time number 延时
 */
const beforeRestartWindow = (win: WindowInstance, time: number) => {
  if (beforeRestartTimer) clearTimeout(beforeRestartTimer);
  beforeRestartTimer = setTimeout(() => {
    restartWindow(win);
    beforeRestartTimer = null;
  }, time);
};

const firstShowMsg = (win: WindowInstance) => {
  const browserWindow = win?.object;
  if (!browserWindow) return;
  const options = {
    type: 'info',
    title: '进程崩溃提醒',
    message: '当前页面出错！正在为您重试',
    buttons: ['重载'],
    icon: getLogoByNativeImage() // 自定义图标
  };
  dialog.showMessageBox(browserWindow, options);
};

const closeWindow = (win: WindowInstance) => {
  const contentsId = win.getContent()?.id;
  if (!contentsId) return;
  win.close();
};

const repeatedlyShowMsg = (win: WindowInstance) => {
  const browserWindow = win?.object;
  if (!browserWindow) return;
  const options = {
    type: 'info',
    title: '进程崩溃提醒',
    message: '当前页面短时间内多次崩溃，是否重启系统？',
    buttons: ['否', '是'],
    icon: getLogoByNativeImage() // 自定义图标
  };
  dialog.showMessageBox(browserWindow, options).then((_val: any) => {
    if (!_val) return;
    switch (_val.response) {
      // 重载窗口
      case 0:
        win?.getContent()?.reloadIgnoringCache();
        win?.getContent()?.once('dom-ready', () => win?.close());
        break;
      // 退登重启
      default: {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        beforeMainRestart(win, 0);
        break;
      }
    }
  });
};

const firstRestart = (win: WindowInstance) => {
  firstShowMsg(win);
  restartWindowFlag = true;
  beforeRestartWindow(win, 1500);
};

/** 多次重启扔不成功 */
const repeatedlyRestart = (win: WindowInstance) => {
  postMessageAllWindow(IPCEventEnum.BeforeAppRestartByCrash, true);
  repeatedlyShowMsg(win);
  restartWindowFlag = true;
};

/**
 * 某窗口或某个错误，需要重启oms
 * @param win 当前窗口
 * @param time 延迟
 */
export const beforeMainRestart = (win: WindowInstance, time = 1500) => {
  restartWindowFlag = true;
  setTimeout(() => {
    win.getContent()?.postMessage(WindowCrashedEnum.PageErrorCallback, []);
    setTimeout(() => {
      appRestart();
    }, 500);
  }, time);
};

const mainShowMsg = (win: WindowInstance) => {
  const browserWindow = win?.object;
  if (!browserWindow) return;
  const isLayout = isHomeOrProductPanel(win);
  const options = {
    type: 'info',
    title: '进程崩溃提醒',
    message: '系统出错！请联系管理员！',
    buttons: ['确定'],
    icon: getLogoByNativeImage() // 自定义图标
  };
  dialog.showMessageBox(browserWindow, options).then((_val: any) => {
    if (!_val) return;
    switch (_val.response) {
      // 重载窗口
      case 0:
        beforeRestartWindow(win, 0);
        break;
      // 退登重启
      default: {
        if (isLayout) win.getContent()?.postMessage(WindowCrashedEnum.PageErrorCallback, []);
        else closeWindow(win);
        break;
      }
    }
  });
};

const mainRestart = (win: WindowInstance) => {
  postMessageAllWindow(IPCEventEnum.BeforeAppRestartByCrash, true);
  mainShowMsg(win);
  beforeMainRestart(win);
};

/** 重启间隔，用与判断是否在短时间内多次重启，默认为五分钟 */
const restartTimeStep = 1000 * 60 * 5;

/** 窗口的webContents无响应后 */
export const windowRecovery = (win: WindowInstance | null) => {
  if (!win) return;
  // TODO: 暂时改为崩溃一次就提示重试；
  const { lastRestartTimestamp } = win;
  const isLayout = isHomeOrProductPanel(win);
  if (isLayout) {
    mainRestart(win);
  } else if (lastRestartTimestamp && Date.now() - lastRestartTimestamp < restartTimeStep) {
    /**
     * 两个都有值，并且第一个时间点在五分钟内，满足“五分钟内崩溃次数>=3”
     */
    repeatedlyRestart(win);
  } else {
    firstRestart(win);
  }
};

/**
 * 给窗口设置一些异常处理监听
 * @param win 当前窗口
 */
export const monitorWindowError = (win: WindowInstance | null) => {
  const content = win?.getContent();
  if (!win || !content) return;
  let unResponsiveTimer: NodeJS.Timeout | null = null;
  // Ranges:
  //     0- 99 System related errors
  //   100-199 Connection related errors
  //   200-299 Certificate errors
  //   300-399 HTTP errors
  //   400-499 Cache errors
  //   500-599 ?
  //   600-699 FTP errors
  //   700-799 Certificate manager errors
  //   800-899 DNS resolver errors
  /** 导航加载失败之后触发 */
  content.on(
    'did-fail-load',
    (_event, _errorCode, errorDescription, validatedURL, isMainFrame, frameProcessId, frameRoutingId) => {
      const msg = `
        :: did-fail-load;
        errorDescription: ${errorDescription},
        validatedURL: ${validatedURL},
        isMainFrame: ${isMainFrame},
        frameProcessId: ${frameProcessId},
        frameRoutingId: ${frameRoutingId}
      `;
      setTimeout(() => {
        printLog(msg);
      }, 5000);
      win?.down();
    }
  );
  // TODO: 需要加一个延迟，规避一些因死循环暂时无响应造成的问题；
  /** webContents无响应时触发 */
  content.on('unresponsive', () => {
    /** 延迟15秒，防止一些长任务的情况 */
    unResponsiveTimer = setTimeout(() => windowRecovery(win), 15000);
  });
  content.on('responsive', () => {
    if (unResponsiveTimer != null) clearTimeout(unResponsiveTimer);
  });
  /** 渲染器进程意外消失时触发。 这种情况通常因为进程崩溃或被杀死。 */
  content.on('render-process-gone', (event: Electron.Event, details: Electron.RenderProcessGoneDetails) => {
    console.log('...error - event.target: ', event.target);
    const { reason } = details || {};
    if (win?.object == null || !reason) return;
    /** crashed-进程崩溃；oom-进程内存不足； */
    if (reason === 'crashed' || reason === 'oom') {
      windowRecovery(win);
    }
    // switch (details.reason) {
    //   /** 进程崩溃 */
    //   case 'crashed':
    //   /** 进程内存不足 */
    //   case 'oom': {
    //     windowRecovery(win);
    //     break;
    //   }
    //   /** 以零为退出代码退出的进程，此种情况不用处理 */
    //   case 'clean-exit':
    //   /** 以非零退出代码退出的进程，需要综合测试是否需要添加进崩溃恢复流程中 */
    //   case 'abnormal-exit':
    //   /** 进程被杀死 */
    //   case 'killed':
    //   /** 进程未能成功启动 */
    //   case 'launch-failed': {
    //     break;
    //   }
    //   default: {
    //     break;
    //   }
    // }
  });
  /** 当预加载脚本的 preloadPath 引发未处理的异常 error 时触发。
   * 暂时不用处理该错误
   */
};

const onPageError = (_e: IpcMainEvent) => {
  const win = WindowManager.getByContentsId(_e.sender.id);
  windowRecovery(win);
};

/** 渲染器进程意外消失时触发。 这种情况通常因为进程崩溃或被杀死。 */
const renderProcessGone = (
  _event: Electron.Event,
  _webContents: Electron.WebContents,
  details: Electron.RenderProcessGoneDetails
) => {
  const win = WindowManager.getByContentsId(_webContents.id);
  const msg = '渲染进程意外消失，原因：';
  const subMsg = `name：${win?.name}，route：${win?.custom?.route}，exitCode：${details.exitCode}`;
  switch (details.reason) {
    case 'crashed': {
      captureMessage(`${msg}崩溃（一般为前端错误导致），${subMsg}`);
      break;
    }
    case 'oom': {
      captureMessage(`${msg}进程内存不足！${subMsg}`);
      break;
    }
    case 'killed': {
      captureMessage(`${msg}进程被杀死, ${subMsg}`);
      break;
    }
    /** 进程从未成功启动 */
    case 'launch-failed': {
      captureMessage(`${msg}进程从未成功启动, ${subMsg}`);
      break;
    }
    default: {
      break;
    }
  }
  /** 进程意外丢失 且 还能检测到窗口的情况，会导致个别窗口（如报价）打开时空白，尝试手动close */
  if (win?.isAlive()) {
    win?.object?.close();
  }
  WindowManager.delete(win?.name ?? '');
};

type ProcessGoneEvents = {
  [key in UtilityProcessServiceNameEnum]: VoidFunction;
};

/** 子进程消息后的处理回调 */
const processGoneEvents: ProcessGoneEvents = {
  [UtilityProcessServiceNameEnum.DataLocalization]: () => {
    localizationProcessGone(appRestart);
  }
};

/** 非渲染子进程意外消失处理函数 */
const childProcessGone = (_event: Electron.Event, details: Electron.Details) => {
  if (details.reason === 'clean-exit') return;
  if (details.name) {
    processGoneEvents[details.name as UtilityProcessServiceNameEnum]?.();
  }
};

/** 模拟程序崩溃，高风险动作，只允许非正式环境开启 */
const monitorWindowCrash = () => {
  if (!isProd()) {
    process.crash();
  }
};

const start = () => {
  ipcMain.on(WindowCrashedEnum.PageError, onPageError);
  ipcMain.on(WindowCrashedEnum.TestSystemCrash, monitorWindowCrash);
  /** 渲染进程的崩溃 */
  app.on('render-process-gone', renderProcessGone);
  /** 非渲染子进程的崩溃 */
  app.on('child-process-gone', childProcessGone);
  /** 崩溃后的退登 */
  ipcMain.handle(IPCEventEnum.afterLogoutFromAppRestart, afterLogoutFromAppRestart);
};

const end = () => {
  ipcMain.off(WindowCrashedEnum.PageError, onPageError);
  ipcMain.off(WindowCrashedEnum.TestSystemCrash, monitorWindowCrash);
  app.off('render-process-gone', renderProcessGone);
  app.off('child-process-gone', childProcessGone);
  /** 崩溃后的退登 */
  ipcMain.handle(IPCEventEnum.afterLogoutFromAppRestart, afterLogoutFromAppRestart);
};

/**
 * 窗口崩溃处理
 */
export default () => [start, end];
