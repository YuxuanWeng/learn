import { LOGGER_URL } from '@fepkg/business/constants/upload-url';
import { errorToString } from '@fepkg/common/utils/utils';
import { Logger, LoggerMeta } from '@fepkg/logger';
import { Post } from '@fepkg/services/types/bdm-enum';

// export const env: AppEnv = appConfig?.env || 'dev';

export const defaultMeta: LoggerMeta = {
  userId: '',
  userPost: Post.PostNone, // 用户岗位 enum(1表示经纪人；2表示助理经纪人；3表示经纪人培训生；4表示DI；5表示后台)
  account: '',
  version: __APP_SHORT_HASH__,
  apiEnv: __API_ENV__,
  deviceType: navigator.userAgent, // 设备型号
  softLifecycleId: '', // 一次应用生命周期
  deviceId: '', // 设备id
  uploadUrl: LOGGER_URL
};

export const logger = new Logger({ source: 'window', meta: defaultMeta });

export const setLoggerMeta = (meta?: Pick<LoggerMeta, 'userId' | 'userPost' | 'account'>) => {
  logger.setMeta({ ...defaultMeta, ...meta });
};

export const trackPoint = (name: string, params?: object, immediate = true) => {
  if (!name) return;
  logger.i({ remark: name, type: 'track-point', ...params }, { immediate });
};

type ILogError = {
  keyword?: string;
  error?: unknown;
} & Record<string, unknown>;
export const logError = ({ keyword, error, ...rest }: ILogError, immediate = true) => {
  logger.e(
    {
      keyword,
      ...(keyword ? { keyword } : {}),
      ...(error ? { error: errorToString(error) } : {}),
      ...rest
    },
    { immediate }
  );
};
