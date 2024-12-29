import { LogContext, LogLevel } from '@fepkg/logger';
import {
  DataLocalizationAction,
  DataLocalizationEvent,
  DataLocalizationRequest,
  DataLocalizationResponse
} from 'app/types/DataLocalization';
import { UtilEventEnum, WindowChannelEventEnum } from 'app/types/IPCEvents';
import { UtilityProcessServiceNameEnum } from 'app/utility-process/utility-types';
import { metrics } from 'app/utils/main-metrics';
import { printLog } from 'app/utils/print-log';
import { getLogoByNativeImage } from 'app/utils/utools';
import { emptyDir } from 'app/windows/utils';
import { IpcMainEvent, IpcMainInvokeEvent, MessageChannelMain, app, dialog, ipcMain, utilityProcess } from 'electron';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { WindowManager } from '../models/windows-manager';
import { userInitConfigStorage } from '../store/user-init-config-storage';
import { logToLocal } from './business-log-listener';

let childUtility: Electron.UtilityProcess | null;
/** 崩溃重启的最大次数 */
const maxRetries = 2;
/** 记录本地化日志进程的崩溃时间 */
const processGoneRecords: number[] = [];
/** 进程崩溃的最大时长间隔，默认为两分钟内崩溃超过两次，即判定为失效，需要强制用户重启BDS */
const goneMaximumInterval = 2 * 60 * 1000;

/** 往utility process进程发消息 */
const postToChild = (
  msg: Omit<DataLocalizationRequest<unknown>, 'local_request_trace_id'>,
  transfer?: Electron.MessagePortMain[] | undefined
) => {
  const local_request_trace_id = v4();
  return childUtility?.postMessage({ ...msg, local_request_trace_id }, transfer);
};

/** 处理日志记录 */
const handleLogMessage = (e: DataLocalizationResponse<LogContext[]>) => {
  // 接收utilityProcess消息回调，用户记录日志
  const { value: logContext, action } = e;
  if (action === DataLocalizationAction.Log && logContext) {
    // 提供utilityProcess进程向主进程log窗口打日志的能力

    logContext.forEach(item => {
      printLog('DATA_LOCALIZATION:', item);

      logToLocal(item);
    });
  }
};

/** 初始化utility process进程 */
const initUtilityProcess = () => {
  // 开启UtilityProcess
  try {
    if (childUtility) {
      childUtility.kill();
      childUtility = null;
    }

    childUtility = utilityProcess.fork(path.join(__dirname, 'utility-process.js'), void 0, {
      serviceName: UtilityProcessServiceNameEnum.DataLocalization
    });
    // 日志本地化记录
    childUtility.addListener('message', handleLogMessage);
  } catch (e) {
    if (e instanceof Error) {
      logToLocal({ level: LogLevel.ERROR, error: 'initUtilityProcess error', message: e.message });
    }
  }
};

const startDataController = () => {
  const config = userInitConfigStorage.getUserInitConfig();
  if (!config) {
    throw new Error('userInitConfig is undefined!');
  }
  // 配置记录
  const dbFileName = `bds-${config?.env}-data-localization.db`;
  const dbFileDir = path.join(app.getPath('userData'), 'databases', 'data-localization');
  if (!existsSync(dbFileDir)) {
    mkdirSync(dbFileDir);
  }
  postToChild({
    action: DataLocalizationAction.Start,
    value: { ...config, dbFilePath: path.join(dbFileDir, dbFileName) }
  });
};

/** 关闭UtilityProcess进程 */
export const handleDataLocalizationEnd = () => {
  childUtility?.postMessage({
    action: DataLocalizationAction.End
  });
};

/** 在src/pages/common/Login/index.tsx中afterLogin后发起start流程，启动UtilityProcess进程 */
export const handleDataLocalizationStart = (_evt?: IpcMainInvokeEvent) => {
  // 防止此时utilityProcess未启动
  handleDataLocalizationEnd();
  initUtilityProcess();

  startDataController();
};

/** 在useDataLocalizationPort中发起, 每个渲染进程都会new一对port */
function handleNewPort(senderId: number): number | null;
function handleNewPort(_evt: IpcMainInvokeEvent): number | null;
function handleNewPort(params: IpcMainInvokeEvent | number): number | null {
  // port1为utilityProcess，port2位渲染进程使用
  const senderId = typeof params === 'object' ? params.sender.id : params;
  const { port1, port2 } = new MessageChannelMain();

  const allWindows = WindowManager.getWindows().filter(item => !WindowManager.isInPool(item.name));

  // 向utilityProcess同步port
  postToChild(
    {
      action: DataLocalizationAction.NewPort,
      value: { portId: senderId, aliveWindows: allWindows.map(item => item.getContent()?.id) }
    },
    [port1]
  );

  // 向渲染进程同步port
  const win = allWindows.find(item => item.getContent()?.id === senderId);
  win?.getContent?.()?.postMessage(WindowChannelEventEnum.AddUtilityProcessPort, '', [port2]);

  return senderId;
}

/** 验证是否可以重启 */
const checkMaxRetries = (now: number) => {
  /**
   * 超过最大崩溃次数：当前crash的时间减去时间段内的首次crash时间
   * 且
   * 超出崩溃记录最大限制：崩溃记录的长度等于最大限制次数 + now本次
   */
  if (now - processGoneRecords[0] <= goneMaximumInterval && processGoneRecords.length === maxRetries) {
    return true;
  }
  return false;
};

/** 添加崩溃时间记录 */
const addProcessGoneRecord = (time: number) => {
  processGoneRecords.push(time);
  if (processGoneRecords.length <= maxRetries) return;
  processGoneRecords.shift();
};

const restartOMSFromLocalizationCrash = (appRestart?: VoidFunction) => {
  // ..短时间内崩溃次数超过最大限制，强制用户重启；
  const options = {
    type: 'info',
    title: '进程崩溃提醒',
    message: '数据同步服务短时间内多次崩溃，将重启系统',
    buttons: ['确定'],
    icon: getLogoByNativeImage() // 自定义图标
  };
  dialog.showMessageBox(options).then(_val => {
    if (!_val) return;
    switch (_val.response) {
      // 退登重启
      default: {
        // 开始重启
        handleDataLocalizationEnd();
        appRestart?.();
        break;
      }
    }
  });
};

/** 进程崩溃 */
export const localizationProcessGone = (appRestart?: VoidFunction) => {
  metrics.counter('utility_process_gone');

  const dt = Date.now();
  const hasRestart = checkMaxRetries(dt);
  addProcessGoneRecord(Date.now());
  if (!hasRestart) {
    handleDataLocalizationEnd();
    initUtilityProcess();
    startDataController();

    WindowManager.getWindows()?.forEach(item => {
      const id = item.getContent()?.id;
      if (id) {
        handleNewPort(id);
      }
    });
  } else {
    restartOMSFromLocalizationCrash(appRestart);
  }
};

export const handleRemovePort = (_evt: IpcMainInvokeEvent, portId?: number) => {
  if (portId) {
    postToChild({
      action: DataLocalizationAction.RemovePort,
      value: { portId }
    });
  }
};

const updateToken = (_evt: IpcMainEvent, token: string) => {
  childUtility?.postMessage({
    action: DataLocalizationAction.TokenUpdate,
    value: { token }
  });
};

/**
 * 关闭数据本地化，并清空本地数据库
 */
export const restDataLocalization = (): Promise<boolean> => {
  return new Promise(resolve => {
    handleDataLocalizationEnd();
    setTimeout(() => {
      try {
        emptyDir(path.join(app.getPath('userData'), 'databases', 'data-localization'));
        resolve(true);
      } catch {
        /* empty */
        resolve(false);
      }
    }, 1000);
  });
};

const checkDataLocalization = (): Promise<{ pid?: number }> => {
  return new Promise((resolve, reject) => {
    const local_request_trace_id = v4();
    let timer: NodeJS.Timeout;

    const listener = (evt: DataLocalizationResponse<{ pid: number }>) => {
      if (local_request_trace_id === evt?.local_request_trace_id) {
        childUtility?.removeListener('message', listener);
        clearTimeout(timer);
        resolve(evt?.value || {});
      }
    };

    // 本地数据平均相应时长为30ms内，超过1000ms则视为服务无响应
    timer = setTimeout(() => {
      childUtility?.removeListener('message', listener);
      reject(
        new Error(
          `utilityProcess is timeout!.
           local_request_trace_id:${local_request_trace_id}`
        )
      );
    }, 300); // windows机器下启动后第一次出现过6-8s的时间

    childUtility?.addListener('message', listener);
    childUtility?.postMessage({
      action: DataLocalizationAction.GetLocalDataInfo,
      value: {
        local_request_trace_id
      }
    });
  });
};

const start = () => {
  initUtilityProcess();
  ipcMain.handle(DataLocalizationEvent.Start, handleDataLocalizationStart);
  ipcMain.handle(DataLocalizationEvent.NewPort, handleNewPort);
  ipcMain.handle(DataLocalizationEvent.RemovePort, handleRemovePort);
  ipcMain.handle(DataLocalizationEvent.End, handleDataLocalizationEnd);
  ipcMain.handle(DataLocalizationEvent.CheckStatus, checkDataLocalization);
  ipcMain.on(UtilEventEnum.UpdateToken, updateToken);
};

const end = () => {
  ipcMain.off(DataLocalizationEvent.Start, handleDataLocalizationStart);
  ipcMain.off(DataLocalizationEvent.NewPort, handleNewPort);
  ipcMain.off(DataLocalizationEvent.RemovePort, handleRemovePort);
  ipcMain.off(DataLocalizationEvent.End, checkDataLocalization);
  ipcMain.off(UtilEventEnum.UpdateToken, updateToken);
  childUtility?.kill();
};

export default () => [start, end];
