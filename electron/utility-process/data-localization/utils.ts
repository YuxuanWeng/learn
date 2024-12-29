import { errorToString } from '@fepkg/common/utils';
import { LogContext, Logger, LoggerMeta } from '@fepkg/logger';
import { Metrics } from '@fepkg/metrics';
import { Post } from '@fepkg/services/types/enum';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { DataLocalizationResponse } from 'app/types/DataLocalization/Response';
import { v4 } from 'uuid';

export const postToMain = <T>(data: DataLocalizationResponse<T>) => {
  process.parentPort.postMessage(data);
};

const onSend = (value: LogContext[]) => {
  postToMain<LogContext[]>({ action: DataLocalizationAction.Log, local_request_trace_id: v4(), value });
};

const DEFAULT_META: LoggerMeta = {
  userId: '',
  userPost: Post.PostNone, // 用户岗位 enum(1表示经纪人；2表示助理经纪人；3表示经纪人培训生；4表示DI；5表示后台)
  account: '',
  version: '',
  softLifecycleId: '', // 一次应用生命周期
  deviceId: '', // 设备id
  apiEnv: 'dev',
  deviceType: '', // 设备型号
  uploadUrl: ''
};

export const logger = new Logger({ source: 'utility-process', meta: DEFAULT_META, onSend });

/**
 * 用于try catch等场景的error记录
 */
export const logError = (error: unknown, keyword = 'utility process error', params?: Record<string, unknown>) => {
  logger.e(
    {
      keyword,
      error: errorToString(error),
      ...params
    },
    { immediate: true }
  );
};

export const metrics = new Metrics({
  meta: DEFAULT_META,
  source: 'utilityProcess',
  logger
});

export const trackPoint = (params = {}) => {
  logger.i(
    {
      type: 'track-point',
      ...params
    },
    { immediate: true }
  );
};

export const trackPointWithMetrics = (keyword: string, logParams = {}) => {
  logger.i(
    {
      type: 'track-point',
      ...logParams,
      keyword
    },
    { immediate: true }
  );

  metrics.counter(keyword, 1);
};
