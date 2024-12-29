import { useEffect } from 'react';
import { LogEventEnum } from 'app/types/IPCEvents';
import { MainLogResponse } from 'app/types/main-log';
import localforage from 'localforage';
import { LSKeys } from '@/common/constants/ls-keys';

const printLog = (res?: MainLogResponse[]) => {
  if (!res?.length) return;
  /** 迭代打印 */
  for (const item of res) {
    console.log(`-- 主进程日志 --, 时间戳：${item.timestamp}, 消息：`, ...item.msg);
  }
};

/** 将版本号转换成数字 */
const versionToNumber = (val?: string) => {
  if (!val) return 0;
  return parseInt(val.replaceAll('.', ''), 10);
};

/** 判断本次版本是否需要清除本地缓存 */
const shouldClearLocalCache = () => {
  try {
    // 获取当前版本
    const curVersion = window.appConfig.staticVersion;
    // 获取历史版本
    const prevVersion = localStorage.getItem(LSKeys.Version);
    // 获取配置文件
    const { cacheCleanupRequired } = window.appConfig;

    if (!cacheCleanupRequired) return false;

    if (!prevVersion) {
      // 如果不存在之前的版本，那么将本次版本号重新缓存进去
      localStorage.setItem(LSKeys.Version, curVersion);
      return false;
    }

    if (versionToNumber(prevVersion) >= versionToNumber(curVersion)) return false;

    return true;
  } catch (error) {
    console.log('[shouldClearLocalCache] error', error);
    return false;
  }
};

/** 清除本地缓存 */
const clearLsCache = async () => {
  try {
    localStorage.clear();
    await localforage.clear();
  } catch (error) {
    console.log('[localStorage] clearLsCache error', error);
  }
};

const updateVersion = () => {
  try {
    localStorage.setItem(LSKeys.Version, window.appConfig.staticVersion);
  } catch {
    // 如果更新版本号失败，为避免每次退登录都会走到清空逻辑，故将版本号清空
    localStorage.setItem(LSKeys.Version, '');
  }
};

/** 初始化相关配置 */
export const useInit = () => {
  const cacheCleanupRequired = shouldClearLocalCache();

  useEffect(() => {
    if (!cacheCleanupRequired) return;
    (async () => {
      await clearLsCache();
    })();
  }, [cacheCleanupRequired]);

  // 打印主进程发来的日志
  useEffect(() => {
    window.Main?.on(LogEventEnum.PrintMainLog, printLog);
    // 主动告知主进程当前已就绪，如有队列日志立即发送；
    window.Main?.invoke?.(LogEventEnum.PrintWindowReady)?.then(printLog);
  }, []);

  updateVersion();
};
