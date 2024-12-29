import { errorToString, noNil } from '@fepkg/common/utils';
import { IMetricsRequest } from '@fepkg/metrics';
import { isLogoutAxiosError } from '@/common/request';
import { logger } from '.';
import { metrics } from '../metrics';

type ILogError = {
  keyword?: string;
  error?: unknown;
} & Record<string, unknown>;
export const logError = ({ keyword, error, ...rest }: ILogError, sendMetrics = false, immediate = true) => {
  logger.e(
    {
      keyword,
      ...(keyword ? { keyword } : {}),
      ...(error ? { error: errorToString(error) } : {}),
      ...rest
    },
    { immediate }
  );

  if (sendMetrics) {
    metrics.counter(keyword?.replaceAll('.', '_') ?? 'unknown_keyword', 1);
  }
};

export const logDataError = ({ api, logName, traceId, error }: IMetricsRequest) => {
  const loggerData = noNil({ api, id: traceId, keyword: logName, error }, { keepFalse: true, keepZero: true });
  if (!loggerData || isLogoutAxiosError(error)) return;

  logError(loggerData, false, false);
};
