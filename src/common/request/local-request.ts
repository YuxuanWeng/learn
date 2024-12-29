import { StatusCode } from '@fepkg/request/types';
import { DataLocalizationAction, DataLocalizationRequestCommon } from 'app/types/DataLocalization';
import { isDataLocalization } from '../ab-rules';
import { LocalDataError } from '../hooks/data-localization/utils';
import { logError } from '../utils/logger/data';
import { trackDuration, trackPoint } from '../utils/logger/point';
import { metrics } from '../utils/metrics';

const DataLocalizationAB = 'local_request_ab_rule';
const DataLocalizationWarning = 'local_request_warning';
const DataLocalizationError = 'local_request_error';
const DataLocalizationPostMessageKey = 'local_request_timer';
export const DataLocalizationPostMessageDelayKey = 'local_request_delay_timer';
const PORT_UNDEFINED_ERROR = "utilityProcess'port is undefined!";
const BASE_FUZZY_SEARCH = new Set([
  DataLocalizationAction.InstTraderList,
  DataLocalizationAction.TraderSearch,
  DataLocalizationAction.UserSearch,
  DataLocalizationAction.InstSearch,
  DataLocalizationAction.BondSearch,
  DataLocalizationAction.FuzzySearch
]);

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    const { message } = error;
    if (message === PORT_UNDEFINED_ERROR) {
      return 'port error';
    }
    if (message.includes('timeout')) {
      return 'timeout error';
    }
  }
  return 'code error';
};

const invoke = async <Request, Response>(messages: DataLocalizationRequestCommon<Request>): Promise<Response> => {
  // 有兜底接口的数据本地化，可通过A/B开关切换
  if (BASE_FUZZY_SEARCH.has(messages.action) && !isDataLocalization()) {
    throw new LocalDataError(DataLocalizationAB);
  }

  const startTime = performance.now();
  const { invoke: portPostMessage } = window.UtilityProcess;

  if (!portPostMessage) {
    throw new LocalDataError(PORT_UNDEFINED_ERROR);
  }

  try {
    const result = await portPostMessage<Request, Response>(messages);

    // 日志埋点
    if (result?.local_request_response_time) {
      // 主进程的performanceTime和渲染进程有偏差无法使用
      const duration = Date.now() - result.local_request_response_time;
      trackDuration(DataLocalizationPostMessageDelayKey, duration, 0.5);
    }
    metrics.timer(DataLocalizationPostMessageKey, performance.now() - startTime, { action: messages.action }, true);

    // 错误治理
    if (result?.action === DataLocalizationAction.Unknown) {
      throw new LocalDataError('unknown action');
    }
    if (!result.value) {
      throw new LocalDataError(`The action ${messages.action} response is undefined`);
    }
    if (result.value?.base_response?.code !== StatusCode.Success) {
      throw new LocalDataError(result.value?.base_response?.msg ?? 'unknown error');
    }

    return result.value;
  } catch (error) {
    // a/b开关关闭则报错不打日志
    if (LocalDataError.isLocalDataError(error) && error.message === DataLocalizationAB) {
      return await Promise.reject(error);
    }

    // 基础数据未完成初始化时调用有兜底接口只上报warning信息
    if (
      LocalDataError.isLocalDataError(error) &&
      error.message.includes('数据未初始化完成') &&
      BASE_FUZZY_SEARCH.has(messages.action)
    ) {
      trackPoint('基础数据未初始化完成', DataLocalizationWarning, {
        error
      });
    } else {
      logError(
        { keyword: DataLocalizationError, error, message: getErrorMessage(error), action: messages.action },
        true
      );
    }
    return await Promise.reject(error);
  }
};

const postMessage = <Request>(messages: DataLocalizationRequestCommon<Request>) => {
  const { postMessage: post } = window.UtilityProcess;

  if (!post) {
    throw new Error('localRequest postMessage is undefined');
  }

  return post<Request>(messages);
};

export default {
  invoke,
  postMessage
};
