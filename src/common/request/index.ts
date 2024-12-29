import { message } from '@fepkg/components/Message';
import { API_BASE, API_TIMEOUT } from '@fepkg/request/constants';
import {
  getResponseFulfilledInterceptor,
  getResponseRejectedInterceptor,
  logStartInterceptor,
  responseTraceFulfilledInterceptor,
  responseTraceRejectedInterceptor,
  traceStartInterceptor
} from '@fepkg/request/interceptors';
import { logErr, logSuccess } from '@fepkg/request/log';
import {
  FromSystem,
  RequestConfig,
  RequestInstance,
  RequestMethod,
  RequestParams,
  RequestResponse,
  ResponseError
} from '@fepkg/request/types';
import { handleRequestError, transformConfigByMethod } from '@fepkg/request/utils';
import { context } from '@opentelemetry/api';
import axios from 'axios';
import { afterLogout } from '@/common/utils/login';
import { metrics } from '../utils/metrics';
import { hasFailedTypeList } from './business';
import { IAxiosErrorType, basicRequestInterceptor, headersMetaInterceptor, host } from './interceptors';

export const isLogoutAxiosError = (error: unknown) => {
  return axios.isAxiosError(error) && error.code === IAxiosErrorType.IsLogout;
};

type RequestErrorHandler = (msg: string, type?: 'err' | 'warn') => void;

let onRequestError: RequestErrorHandler = (msg, type = 'err') => {
  if (type === 'err') message?.error(msg);
  else message?.warn(msg);
};

export const setOnRequestError = (handler: RequestErrorHandler) => {
  onRequestError = handler;
};

const getOnRequestError = () => onRequestError;

export const apiAlgoBase = import.meta.env.VITE_API_ALGO_BASE;

const axiosInstance = axios.create({
  baseURL: `${host}${API_BASE}`,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'FROM-SYSTEM': FromSystem.OMS
  }
});

axiosInstance.interceptors.request.use(logStartInterceptor);
axiosInstance.interceptors.request.use(traceStartInterceptor);
axiosInstance.interceptors.request.use(headersMetaInterceptor);
axiosInstance.interceptors.request.use(basicRequestInterceptor);

axiosInstance.interceptors.response.use(
  getResponseFulfilledInterceptor(response => {
    logSuccess(metrics, response);
  }),
  getResponseRejectedInterceptor(err => {
    afterLogout(false, err.response?.data?.base_response?.code);
  })
);
axiosInstance.interceptors.response.use(responseTraceFulfilledInterceptor, responseTraceRejectedInterceptor);

async function innerRequest<R extends RequestResponse, P extends RequestParams>(
  url: string,
  method: RequestMethod,
  params: P,
  config?: RequestConfig
) {
  const requestConfig = transformConfigByMethod(params, {
    url,
    method,
    withCredentials: true,
    hideErrorMessage: false,
    ...config
  });

  try {
    const response = await axiosInstance.request<R>(requestConfig);
    const returnValue = response.data as RequestResponse<R>;
    const { preventExecWithFailed } = config ?? {};

    const failed = hasFailedTypeList(response);
    // TODO: 这里直接Promise.reject走不到下面的logErr
    if (failed && preventExecWithFailed) return await Promise.reject(response);

    return returnValue;
  } catch (error) {
    const err = error as ResponseError;
    handleRequestError({
      error: err,
      config: requestConfig,
      onLogout: code => afterLogout(false, code),
      onMessage: (msg, _, type) => getOnRequestError()?.(msg, type),
      onBusiness: hasFailedTypeList
    });
    logErr(metrics, url, err);
    return Promise.reject(error);
  }
}

const requestMethods: RequestMethod[] = ['get', 'post'];

export default {
  ...requestMethods.reduce((prev, method) => {
    prev[method] = <R extends RequestResponse, P extends RequestParams>(
      url: string,
      params: P,
      config?: RequestConfig
    ) => {
      return innerRequest<R, P>(url, method, params, { ...config, traceCtx: config?.traceCtx ?? context.active() });
    };
    return prev;
  }, {} as RequestInstance)
};
