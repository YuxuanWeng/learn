import { AppEnv } from '@fepkg/common/types';
import { LOG_LOCALFORAGE_KEY, LogCache, Logger, LoggerConfig, LoggerMeta } from '@fepkg/logger';
import IPCEventEnum, { LogEventEnum, UtilEventEnum } from 'app/types/IPCEvents';
import { AppConfig } from 'app/types/app-config';
import localforage from 'localforage';
import { getUploadUrl } from '@packages/utils';
import { miscStorage } from '@/localdb/miscStorage';

const appConfig = await window?.Main?.invoke<AppConfig>?.(UtilEventEnum.GetAppConfig);
const { logUrl } = getUploadUrl(appConfig, miscStorage.apiEnv);

export const env: AppEnv = appConfig?.env || 'dev';

export const meta: LoggerMeta = {
  userId: miscStorage.userInfo?.user_id ?? '',
  userPost: miscStorage.userInfo?.post, // 用户岗位 enum(1表示经纪人；2表示助理经纪人；3表示经纪人培训生；4表示DI；5表示后台)
  account: miscStorage.userInfo?.account ?? '',
  version: appConfig?.version,
  softLifecycleId: miscStorage.softLifecycleId ?? '', // 一次应用生命周期
  deviceId: miscStorage.deviceId ?? '', // 设备id
  apiEnv: miscStorage.apiEnv ?? 'dev',
  deviceType: navigator.userAgent, // 设备型号
  // uploadUrl: `${appConfig.apiHost}${appConfig?.logURL ?? ''}`
  uploadUrl: logUrl
};

const onInit: LoggerConfig['onInit'] = pool => {
  window?.Main?.on?.(IPCEventEnum.BeforeWindowClose, () => {
    localforage.setItem<LogCache[]>(LOG_LOCALFORAGE_KEY, pool);
  });
};

const onSend: LoggerConfig['onSend'] = businessLogs => {
  window.Main?.sendMessage(LogEventEnum.BatchBusinessLog, businessLogs);
};

export const logger = new Logger({ source: 'window', meta, onInit, onSend });
