import { AppEnv } from '@fepkg/common/types';
import { LocalServerEvent } from 'app/types/local-server';
import { getAppConfig } from 'app/utils/get-app-config';
import { logger } from 'app/utils/main-logger';
import { metrics } from 'app/utils/main-metrics';
import { isMac } from 'app/utils/utools';
import { userInitConfigStorage } from 'app/windows/store/user-init-config-storage';
import { emptyDir, getAvailablePort, isPortAvailable } from 'app/windows/utils';
import { ChildProcess, exec } from 'child_process';
import { app, ipcMain } from 'electron';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const MAC_FILE_NAME = 'OMS_LocalServer';
const WIN_FILE_NAME = 'OMS_LocalServer.exe';

/** 崩溃重启的最大次数 */
const maxRetries = 2;
/** 记录本地化日志进程的崩溃时间 */
const processGoneRecords: number[] = [];
/** 进程崩溃的最大时长间隔，默认为两分钟内崩溃超过两次，即判定为失效，需要强制用户重启OMS */
const goneMaximumInterval = 2 * 60 * 1000;
let localServerProcess: ChildProcess | null;
/** 端口号 */
const defaultPort = 8888;

let port = defaultPort;

const appConfig = getAppConfig();

const args = {
  dev: {
    apihost: 'https://api-dev.zoople.cn',
    wshost: 'wss://api-dev.zoople.cn/api/v1/infra/streaming/centrifugo-v4/connection/websocket'
  },
  uat: {},
  test: {
    apihost: 'https://api-test.zoople.cn',
    wshost: 'wss://api-test.zoople.cn/api/v1/infra/streaming/centrifugo-v4/connection/websocket'
  },
  prod: {
    apihost: appConfig.apiHost,
    wshost: appConfig.localServerWSHost
  }
};

const envs = {
  dev: {
    PSM: 'bdm.bds.local_server',
    SERVICE_CONFIG_PATH: './conf',
    SERVICE_ENV_MODE: 'dev',
    SERVICE_FLUENTD_URL: 'https://fluentd-dev.zoople.cn',
    SERVICE_METRICS_INFLUXDB_URL: 'http://influxdb-cluster.dev.zoople.cn:8086',
    SERVICE_PROVIDER_URL: 'otel-collector.dev.zoople.cn:4317'
  },
  uat: {},
  test: {
    PSM: 'bdm.bds.local_server',
    SERVICE_CONFIG_PATH: './conf',
    SERVICE_ENV_MODE: 'test',
    SERVICE_FLUENTD_URL: 'https://fluentd-test.zoople.cn',
    SERVICE_METRICS_INFLUXDB_URL: 'http://influxdb-cluster.test.zoople.cn:8086',
    SERVICE_PROVIDER_URL: 'otel-collector.test.zoople.cn:4317'
  },
  prod: {
    PSM: 'bdm.bds.local_server',
    SERVICE_CONFIG_PATH: './conf',
    SERVICE_ENV_MODE: appConfig.serviceEnvMode,
    SERVICE_FLUENTD_URL: appConfig.serverFluentdURL,
    SERVICE_METRICS_INFLUXDB_URL: appConfig.serviceMetricsInfluxdbURL,
    SERVICE_PROVIDER_URL: appConfig.serviceProviderURL
  }
};
const { shortHash, version } = appConfig.localServer;
const targetVersion = shortHash || version || 'latest';

const fileName = isMac ? MAC_FILE_NAME : WIN_FILE_NAME;
const baseURL = join(__dirname, '../resources/exes/', targetVersion).replace('app.asar', 'app.asar.unpacked');
let env: AppEnv = 'dev';
const localServerDir = join(app.getPath('userData'), 'local-server');
/** 验证是否可以重启 */
const checkMaxRetries = (now: number) => {
  /**
   * 超过最大崩溃次数：当前crash的时间减去时间段内的首次crash时间
   * 且
   * 超出崩溃记录最大限制：崩溃记录的长度等于最大限制次数 + now本次
   */
  return now - processGoneRecords[0] <= goneMaximumInterval && processGoneRecords.length >= maxRetries;
};

export const localServerProcessEnd = () => {
  if (localServerProcess) {
    localServerProcess?.removeAllListeners('close');
    if (isMac) {
      exec(`pkill -TERM -P ${localServerProcess.pid}`);
    } else {
      exec(`taskkill /PID ${localServerProcess.pid} /T /F`);
    }
    localServerProcess = null;
  }
};

export const killLocalServerProcess = () => {
  if (isMac) {
    exec(`killall -TERM ${MAC_FILE_NAME}`);
  } else {
    exec(`taskkill /F /im ${WIN_FILE_NAME} /t`);
  }
};

/** 添加崩溃时间记录 */
const addProcessGoneRecord = (time: number) => {
  processGoneRecords.push(time);
  if (processGoneRecords.length <= maxRetries) return;
  processGoneRecords.shift();
};

/** 初始化LocalServer进程 */
const localServerProcessStart = async () => {
  if (localServerProcess) {
    return;
  }

  try {
    port = await getAvailablePort(defaultPort);
    const envConfig = userInitConfigStorage.getUserInitConfig();
    env = envConfig?.env ?? 'dev';

    const targetURL = join(localServerDir, env);
    const targetPath = join(targetURL, fileName);

    if (!existsSync(localServerDir)) {
      mkdirSync(localServerDir);
    }
    if (!existsSync(targetURL)) {
      mkdirSync(targetURL);
    }
    // 是否调用特定目录下的可执行文件debug
    const isDebug = existsSync(targetPath);

    // exe不存在报错
    if (!isDebug && !existsSync(join(baseURL, fileName))) {
      logger.e({ keyword: 'local_server_not_found', path: baseURL }, { immediate: true });
      return;
    }

    const portStr = `-port=:${port}`;
    const dbURLStr = `-path=${isMac ? '"' : ''}${join(app.getPath('userData'), `local-server/${env}/`)}${
      isMac ? '"' : ''
    }`;

    const arg = Object.entries(args[env])
      .map(([k, v]) => {
        return `-${k}=${v}`;
      })
      .join(' ');
    const startTime = Date.now();
    /** 很没有道理但只能使用exec(shell)，否则无法启动，并且需要将stdio重定向为空 */
    localServerProcess = exec(
      `${fileName} ${arg} ${portStr} ${dbURLStr} ${isMac ? '1>/dev/null 2>&1' : '2>NUL 1>NUL'}`,
      {
        cwd: isDebug ? targetURL : baseURL,
        env: {
          ...envs[env],
          USER_ID: envConfig?.userInfo.user_id,
          DEVICE_ID: envConfig?.deviceId,
          OMS_VERSION: appConfig.staticVersion,
          OMS_HASH: appConfig.shortHash
        }
      }
    );
    // 启动local_server日志
    logger.i({ keyword: 'local_server_process_init', port }, { immediate: true });

    localServerProcess?.addListener('close', (code, signal) => {
      const existsTime = Date.now() - startTime;
      console.log('close', code, signal);
      metrics.counter('local_server_process_close');
      logger.e(
        { keyword: 'local_server_process_close', code, signal, existsTime, port, ...envs[env], arg },
        { immediate: true }
      );
      if (signal) {
        const dt = Date.now();
        const hasRestart = checkMaxRetries(dt);
        addProcessGoneRecord(Date.now());
        if (!hasRestart) {
          localServerProcessEnd();
          setTimeout(() => {
            localServerProcessStart();
          }, 5000);
        } else {
          // restartBDSFromLocalServerCrash();
        }
      }
    });
  } catch (e) {
    logger.e({ keyword: 'local_server_start_error', error: e }, { immediate: true });
  }
};

const getPort = () => {
  return port;
};

/**
 * 关闭local_server，并清空本地数据库
 */
export const restLocalServer = (): Promise<boolean> => {
  return new Promise(resolve => {
    localServerProcessEnd();
    const targetURL = join(localServerDir, env);
    setTimeout(() => {
      try {
        emptyDir(join(targetURL));
        resolve(true);
      } catch {
        /* empty */
        resolve(false);
      }
    }, 5000);
  });
};

/** 重启local-server，使用端口检测判断旧进程是否被杀死 */
const restart = async () => {
  localServerProcessEnd();
  return new Promise((resolve, reject) => {
    let counter = 0;
    const timer = setInterval(async () => {
      counter += 1;
      const isOldProcessExit = await isPortAvailable(port);
      if (isOldProcessExit) {
        clearInterval(timer);
        await localServerProcessStart();
        resolve(void 0);
      } else if (counter > 9) {
        clearInterval(timer);
        logger.e({ keyword: 'local server restart failed, old process still exit', port }, { immediate: true });
        reject(new Error('local server restart failed, old process still exit'));
      }
    }, 1000);
  });
};

const start = () => {
  killLocalServerProcess();
  ipcMain.handle(LocalServerEvent.Start, localServerProcessStart);
  ipcMain.handle(LocalServerEvent.GetPort, getPort);
  ipcMain.handle(LocalServerEvent.Restart, restart);
};

const end = () => {
  localServerProcessEnd();
  ipcMain.off(LocalServerEvent.Start, localServerProcessStart);
  ipcMain.off(LocalServerEvent.GetPort, getPort);
  ipcMain.off(LocalServerEvent.Restart, restart);
};

export default () => [start, end];
