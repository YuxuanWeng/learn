import { parseJSON } from '@fepkg/common/utils';
import { Metrics, metricsRequestDuration, metricsRequestError } from '@fepkg/metrics';
import { RequestConfig, RequestResponse, ResponseError } from '@fepkg/request/types';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';
import { pick } from 'lodash-es';

export function logSuccess(metrics: Metrics, response: AxiosResponse<RequestResponse, RequestConfig>) {
  if (!response) return;
  const cfg = response.config as RequestConfig;
  if (cfg?.url && cfg?.logStartTime) {
    if (cfg.url === '/bond_quote/search') {
      // TODO [轮询]
      // TODO 不要硬编码接口，采用更抽象的 config 配置项
    }
    const { data } = response;
    const duration = performance.now() - cfg.logStartTime;
    metricsRequestDuration(metrics, {
      api: response.config.url,
      duration,
      logName: cfg?.logFlag,
      traceId: data?.base_response?.trace_id,
      request: duration > 1000 ? cfg?.data : void 0
    });
  }
}

/**
 * @param api 请求url
 * @param json  1.后端返回的提示错误 rpc，参数错误  AxiosResponse.data 2.后端返回的异常错误 401  AxiosError.response.data 3.后端未能返回的错误，比如网络连接失败 AxiosError.message
 */
export function logErr(
  metrics: Metrics,
  api?: string,
  json?: AxiosResponse<RequestResponse> | ResponseError | AxiosError
) {
  if (!api) return;
  let msg: string | undefined;
  let jsonStr: string | undefined;
  let errData = (json as AxiosResponse).data || (json as AxiosError).response?.data;
  if (errData) {
    errData = pick(errData, 'base_response', 'status_code', 'status_msg');
    msg = errData.base_response?.msg;
    jsonStr = parseJSON(errData);
  } else {
    const error = json as AxiosError;
    if (axios.isCancel(error)) return;
    if (error?.message) msg = error.message;
  }
  metricsRequestError(metrics, { api, msg, jsonStr });
}
