import { errorToString, parseJSON } from '@fepkg/common/utils';
import { LogContext, LogLevel } from '@fepkg/logger';
// import { omsApp } from 'app/models/oms-application';
import { LogEventEnum } from 'app/types/IPCEvents';
import { deleteFile, getFileList, getFileMTime } from 'app/utils/file';
import { userInitConfigStorage } from 'app/windows/store/user-init-config-storage';
import compressing from 'compressing';
import { IpcMainEvent, IpcMainInvokeEvent, app, ipcMain } from 'electron';
import electronLog, { LogMessage } from 'electron-log';
import { omit } from 'lodash-es';
import moment from 'moment';
import path, { join } from 'path';
import { format } from 'util';

const OSS_BASE_PATH = 'local_log';
type ILogFn = (logStr: string) => void;

/** 不同类型的枚举值映射 */
const logLevelMap = new Map<string, ILogFn>([
  [LogLevel.INFO, electronLog.info],
  [LogLevel.DEBUG, electronLog.debug],
  [LogLevel.WARN, electronLog.warn],
  [LogLevel.ERROR, electronLog.error]
]);

/** 获取crashReportDirectory基本信息 */
function getCrashesDirectoryInfo() {
  const zipName = 'Crashpad.zip';
  const crashDumpsDir = app.getPath('crashDumps');
  const userDataDir = app.getPath('userData');
  return {
    zipName,
    crashDumpsDir,
    userDataDir,
    zipFileFullPath: path.join(userDataDir, zipName)
  };
}

function getLocalServerLogInfo() {
  const envConfig = userInitConfigStorage.getUserInitConfig();
  const env = envConfig?.env ?? 'dev';
  const zipName = 'local-server-log.zip';
  const fullPath = join(app.getPath('userData'), `local-server/${env}/local_server.log`);
  const zipFileFullPath = join(app.getPath('userData'), `local-server/${env}/`, zipName);
  return { zipName, fullPath, zipFileFullPath };
}

/** 本地log记录 */
function log(level: LogLevel, logStr: string) {
  logLevelMap.get(level)?.(logStr);
}

/**
 * electron-log初始化自定义配置
 */
export function initElectronLogDaily() {
  /**
   * 日志文件路径重定义
   */
  function changeLogFilePath() {
    let logFileName = '';
    let logFilePath = '';
    electronLog.transports.file.resolvePath = variables => {
      const filePath = variables.electronDefaultDir ?? '';
      const fileName = `${moment().format('YYYY-MM-DD')}_main.log`; // 当天日期
      try {
        getFileList(filePath).forEach(item => {
          // 尝试删除一周前的过期日志
          if (moment(getFileMTime(filePath, item)).isBefore(moment().subtract(8, 'd'))) {
            deleteFile(filePath, item);
          }
        });
      } catch (e) {
        log(LogLevel.ERROR, `失败! 原因:${errorToString(e)}`);
      }

      logFileName = fileName;
      logFilePath = filePath;

      return path.join(filePath, fileName);
    };
    return {
      logFileName,
      logFilePath
    };
  }

  electronLog.transports.file.fileName = changeLogFilePath().logFileName;
  electronLog.transports.file.maxSize = 10 * 1024 * 1024; // 一天最多10MB
  // 精简控制台输出，warn以下不打印
  // 过滤等级如下 'error' > 'warn' > 'info' > 'verbose' > 'debug' > 'silly'
  electronLog.transports.console.level = 'warn';
  electronLog.transports.console.format = (message: LogMessage) => {
    const data = omit(parseJSON(message.data.toString()), [
      'psm',
      'user_id',
      'user_post',
      'account',
      'version',
      'soft_lifecycle_id',
      'device_id',
      'device_type',
      'time_stamp',
      'api_env',
      'screen_message',
      'metrics_url',
      'upload_url',
      'log_url'
    ]);
    return format(data);
  };
}

/**
 * 渲染进程日志本地化，为后续日志整体转接node sdk打下基础
 */
export const logToLocal = (params: LogContext) => {
  log(params.level, JSON.stringify(params, null, 2));
};

export const batchSaveBusinessLogs = (_event: IpcMainEvent, params: LogContext[]) => {
  if (Array.isArray(params)) {
    params.forEach(item => {
      item.parentContentsId = _event.sender?.id;

      logToLocal(item);
    });
  }
};

// 上传日志
const uploadLog = async (_event: IpcMainInvokeEvent, userId: string, env: string) => {
  try {
    const fileFullPath = electronLog.transports.file?.getFile()?.path;
    const fileName = path.basename(fileFullPath) ?? 'main.log';
    const uploadBasePath = path.join(OSS_BASE_PATH, env, userId);

    // 上传business日志
    // const ossSts = omsApp.appConfig.ossSts ?? OSS_STS_INFO;
    // const client = new OSS(ossSts);
    // await client.put(path.join(uploadBasePath, fileName).replace(/\\/g, '/'), path.normalize(fileFullPath)); // To Linux path

    // 压缩并上传crashReport
    const crashReportInfo = getCrashesDirectoryInfo();
    await compressing.zip.compressDir(crashReportInfo.crashDumpsDir, crashReportInfo.zipFileFullPath);
    // await client.put(
    //   path.join(uploadBasePath, crashReportInfo.zipName).replace(/\\/g, '/'), // To Linux path
    //   path.normalize(crashReportInfo.zipFileFullPath)
    // );

    // 压缩并上传local-server.log
    const localServerLogInfo = getLocalServerLogInfo();
    await compressing.zip.compressFile(localServerLogInfo.fullPath, localServerLogInfo.zipFileFullPath);
    // await client.put(
    //   path.join(uploadBasePath, localServerLogInfo.zipName).replace(/\\/g, '/'), // To Linux path
    //   path.normalize(localServerLogInfo.zipFileFullPath)
    // );
  } catch (e) {
    log(LogLevel.ERROR, `失败! 原因:${errorToString(e)}`);
    return false;
  }
  return true;
};

const start = () => {
  /** 接收business日志 */
  ipcMain.on(LogEventEnum.BatchBusinessLog, batchSaveBusinessLogs);
  /** 监听上传business日志事件 */
  ipcMain.handle(LogEventEnum.PutBusinessLog, uploadLog);
};

const end = () => {
  /** 停止接收business日志 */
  ipcMain.off(LogEventEnum.BatchBusinessLog, batchSaveBusinessLogs);
  /** 停止监听上传business日志事件 */
  ipcMain.off(LogEventEnum.PutBusinessLog, uploadLog);
};

/**
 * 渲染进程business日志本地化
 */
export default () => [start, end];
