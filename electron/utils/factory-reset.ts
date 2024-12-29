import { BrowserWindow, globalShortcut, ipcMain } from 'electron';
import log from 'electron-log';
import { join } from 'path';
import { SystemEventEnum } from '../types/IPCEvents';
import { WindowName } from '../types/window-v2';
import { getDefaultSrcUrl } from '../windows/app-windows';
import { FRAME_WINDOW_CONFIG } from '../windows/constants';
import { restDataLocalization } from '../windows/listeners/data-localization-listener';
import { afterLoginHandler, beforeLogoutHandler } from '../windows/listeners/login-listener';
import { WindowManager } from '../windows/models/windows-manager';
import { windowOpenedStorage } from '../windows/store/window-opened-storage';
import { windowBoundsStorage } from '../windows/store/window-size-storage';
import { delayHelper } from './utools';

let factoryResetFlag = false;

const errorLog = (txt: string) => {
  const errTxt = `== 应用缓存重置：${txt}`;
  log.error(errTxt);
  console.log(errTxt);
};

const clearLocalStorage = (): Promise<boolean> => {
  return new Promise(resolve => {
    try {
      const win = new BrowserWindow({
        ...FRAME_WINDOW_CONFIG.options,
        show: false,
        webPreferences: {
          sandbox: false,
          devTools: false,
          webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
          preload: join(__dirname, './preload.js')
        }
      });
      const url = join(getDefaultSrcUrl(), 'factoryReset.html');
      win.webContents.loadURL(url);
      win.webContents.ipc.on('system-before-factory-reset', () => {
        win?.close();
        resolve(true);
      });
    } catch (err) {
      errorLog('清理前端缓存时出现错误！');
      console.log('-- 清理前端缓存时出现错误！：--', err);
      resolve(false);
    }
  });
};

/**
 * 重置全应用缓存
 * 包括：
 * 1、主进程位置缓存
 * 2、主进程布局缓存
 * 3、localStorage
 * 4、indexDB
 * 5、local-server
 * 6、sqlite
 */
const factoryReset = async (fromHomePage = false): Promise<boolean> => {
  try {
    if (factoryResetFlag) return false;
    // localStorage
    // indexDB
    factoryResetFlag = true;
    const clearLocalRes = await clearLocalStorage();
    if (!clearLocalRes) errorLog('清理前端缓存出现错误！');

    const home = WindowManager.get(WindowName.MainHome);
    const login = WindowManager.get(WindowName.Login);
    const loginIsAlive = !!login?.isAlive();
    if (fromHomePage || home?.isAlive()) {
      // ..先关闭除首页外的其他窗口
      for (const item of WindowManager.getAll()) {
        if (!item.isHome()) item.object?.hide();
      }
    } else {
      // .. 暂时隐藏所有已打开窗口
      for (const item of WindowManager.getAll()) item.object?.hide();
    }

    // local-server
    // const clearLocalServerRes = await restLocalServer();
    // if (!clearLocalServerRes) errorLog('清理local-server时出现错误！');
    // 数据本地化
    const clearLocalizationRes = await restDataLocalization();
    if (!clearLocalizationRes) errorLog('清理数据本地化数据时出现错误！');

    // 退登
    // 先退登，再清理主进程相关缓存，防止与保存布局、位置缓存等逻辑冲突；
    beforeLogoutHandler();
    afterLoginHandler(!loginIsAlive);
    if (loginIsAlive) {
      login?.open();
    }
    await delayHelper(500)();

    // 清理主进程位置缓存
    await windowBoundsStorage.clear();
    // 主进程布局缓存
    await windowOpenedStorage.clear();

    factoryResetFlag = false;
    return true;
  } catch {
    errorLog('清理主进程缓存出现错误！');
    factoryResetFlag = false;
    return false;
  }
};

const localDBReset = async (fromHomePage = false): Promise<boolean> => {
  try {
    const home = WindowManager.get(WindowName.MainHome);
    const login = WindowManager.get(WindowName.Login);
    const loginIsAlive = !!login?.isAlive();
    if (fromHomePage || home?.isAlive()) {
      // ..先关闭除首页外的其他窗口
      for (const item of WindowManager.getAll()) {
        if (!item.isHome()) item.object?.hide();
      }
    } else {
      // .. 暂时隐藏所有已打开窗口
      for (const item of WindowManager.getAll()) item.object?.hide();
    }
    // 数据本地化
    const clearLocalizationRes = await restDataLocalization();
    if (!clearLocalizationRes) errorLog('清理数据本地化数据时出现错误！');
    // 退登
    // 先退登，再清理主进程相关缓存，防止与保存布局、位置缓存等逻辑冲突；
    beforeLogoutHandler();
    afterLoginHandler(!loginIsAlive);
    if (loginIsAlive) {
      login?.open();
    }
    return true;
  } catch {
    errorLog('清理本地数据库出现错误！');
    return false;
  }
};

const handleFactoryReset = () => factoryReset(true);

const handleLocalDBReset = () => localDBReset(true);

/**
 * 注册“应用缓存重置”的快捷键
 * 注意的是：必须在 app.whenReady 后才可以注册
 */
export const registerFactoryReset = () => {
  ipcMain.removeAllListeners(SystemEventEnum.FactoryReset);
  ipcMain.handle(SystemEventEnum.FactoryReset, handleFactoryReset);
  ipcMain.removeAllListeners(SystemEventEnum.LocalDBReset);
  ipcMain.handle(SystemEventEnum.LocalDBReset, handleLocalDBReset);

  const ret = globalShortcut.register('CmdOrCtrl+Alt+Shift+0', () => factoryReset());

  const errTxt = '注册快捷键失败！';
  if (!ret) {
    errorLog(errTxt);
  }
};
