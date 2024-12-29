import { withNewSpan } from '@fepkg/trace';
import { localServerProcessEnd } from 'app/windows/listeners/local-server-listener';
import { Menu, app, protocol } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { machineId as getMachineId } from 'node-machine-id';
import { initNodeTracer } from '@packages/trace/node';
import { omsApp } from './models/oms-application';
import { WindowName } from './types/window-v2';
import { patchAutoUpdater } from './utils/auto-update';
import { displayMetricsChanged, judgeCheckActiveDisplay } from './utils/bounds-helper-v2';
import { initCrashReporter } from './utils/electron-crash-reporter';
import { isProd } from './utils/electron-is-dev';
import { initSentry, setSentryDeviceId } from './utils/electron-sentry';
import { registerFactoryReset } from './utils/factory-reset';
import { judgeAppQuitByLayout } from './utils/layouts';
import { createLoginWindow } from './windows/app-windows';
import { getMenuTemplate } from './windows/dialog/menu';
import { listeners } from './windows/listeners';
import { initElectronLogDaily } from './windows/listeners/business-log-listener';
import { setDeviceId, softLifecycleId } from './windows/listeners/util-listener';
import { WindowManager } from './windows/models/windows-manager';
import { windowOpenedStorage } from './windows/store/window-opened-storage';
import { windowBoundsStorage } from './windows/store/window-size-storage';
import { isDevToolsDisabled } from './windows/windows-tools';

omsApp.initialize();

initSentry(softLifecycleId);
initCrashReporter();
initElectronLogDaily(); // 本地日志配置初始化

const illegalArgs = ['--inspect', '--show-devtools', '--remote-debugging-port'];

if (isDevToolsDisabled() && isProd()) {
  if (
    process.argv.some(argv => {
      return illegalArgs.some(ia => argv.startsWith(ia));
    })
  ) {
    omsApp.quit();
  }
}

// 标明是否为首次登录
let hasInit = false;

omsApp.onReady(() => {
  /** 清空缓存 */
  registerFactoryReset();

  initNodeTracer();

  withNewSpan('create_login_window', createLoginWindow, {
    isFirst: !hasInit,
    showLoading: true
  });

  // 异步方式方式获取deviceId
  getMachineId()
    .then(deviceId => {
      // 设置向渲染进程传递的deviceId的值
      setDeviceId(deviceId);
      // 设置electron-sentry的参数
      setSentryDeviceId(deviceId);
    })
    .catch(() => {
      // 设置向渲染进程传递的deviceId的值
      setDeviceId('unknown');
      // 设置electron-sentry的参数
      setSentryDeviceId('unknown');
    });

  windowBoundsStorage.init();
  windowOpenedStorage.init();
  judgeCheckActiveDisplay();
  displayMetricsChanged();
  hasInit = true;

  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => {
      console.log(`Added Extension:  ${name}`);
    })
    .catch(err => {
      console.log('An error occurred: ', err);
    });

  patchAutoUpdater();

  // 挂载 listener 的 Start
  for (const [start] of listeners) start?.();

  const menu = Menu.buildFromTemplate(getMenuTemplate());
  Menu.setApplicationMenu(menu);

  // 处理cq图片防盗链
  protocol.interceptHttpProtocol('cqhttp', (request, callback) => {
    callback({ url: request.url.replace('cqhttp://', 'http://') });
  });

  protocol.interceptHttpProtocol('cqhttps', (request, callback) => {
    callback({ url: request.url.replace('cqhttps://', 'https://') });
  });
});

omsApp.onBeforeQuit((ev?: Electron.Event) => {
  const home = WindowManager.get(WindowName.MainHome) ?? undefined;
  judgeAppQuitByLayout(ev, home);
});

const restoreMainWindow = () => {
  const homeWindow = WindowManager.get(WindowName.MainHome);
  const loginWindow = WindowManager.get(WindowName.Login);
  const updateWindow = WindowManager.get(WindowName.UpdateDownload);

  if (homeWindow != null) {
    homeWindow.focus();
  } else if (loginWindow != null) {
    loginWindow?.focus();
  } else {
    updateWindow?.focus();
  }
};

omsApp.onActivate(() => {
  if (WindowManager.size() === 0) {
    createLoginWindow({ showLoading: true });
  } else restoreMainWindow();
});

omsApp.onSecondInstance(restoreMainWindow);

// 系统正常退出后结束local_server进程
app.on('will-quit', () => {
  localServerProcessEnd();
});
