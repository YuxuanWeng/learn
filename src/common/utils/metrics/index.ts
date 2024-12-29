import { AppEnv } from '@fepkg/common/types';
import { Metrics, MetricsMeta } from '@fepkg/metrics';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { AppConfig } from 'app/types/app-config';
import { getUploadUrl } from '@packages/utils';
import { miscStorage } from '@/localdb/miscStorage';
import { logger } from '../logger';

const appConfig = await window?.Main?.invoke<AppConfig>?.(UtilEventEnum.GetAppConfig);

export const env: AppEnv = appConfig?.env || 'dev';
const { metricsUrl } = getUploadUrl(appConfig, miscStorage.apiEnv);

export const meta: MetricsMeta = {
  userId: miscStorage.userInfo?.user_id ?? '',
  userPost: miscStorage.userInfo?.post, // 用户岗位 enum(1表示经纪人；2表示助理经纪人；3表示经纪人培训生；4表示DI；5表示后台)
  account: miscStorage.userInfo?.account ?? '',
  version: appConfig?.version,
  softLifecycleId: miscStorage.softLifecycleId ?? '', // 一次应用生命周期
  deviceId: miscStorage.deviceId ?? '', // 设备id
  apiEnv: miscStorage.apiEnv ?? 'dev', // 设备id
  deviceType: navigator.userAgent, // 设备型号
  // uploadUrl: appConfig?.metricsURL ?? ''
  uploadUrl: metricsUrl
};

export const metrics = new Metrics({ source: 'window', meta, logger });
