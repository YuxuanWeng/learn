import { message } from '@fepkg/components/Message';
import { API_BASE, API_TIMEOUT } from '@fepkg/request/constants';
import { getResponseFulfilledInterceptor, getResponseRejectedInterceptor } from '@fepkg/request/interceptors';
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
import { basicRequestInterceptor, headersMetaInterceptor, host } from './interceptors';
import { handleLogout } from './logout';

export const apiBase = API_BASE;

const axiosInstance = axios.create({
  baseURL: `${host}${apiBase}`,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'FROM-SYSTEM': FromSystem.ODM
  }
});

axiosInstance.interceptors.request.use(headersMetaInterceptor);
axiosInstance.interceptors.request.use(basicRequestInterceptor);

axiosInstance.interceptors.response.use(
  getResponseFulfilledInterceptor(),
  getResponseRejectedInterceptor(err => {
    handleLogout(err.response?.data?.base_response?.code);
  })
);

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
  } as RequestConfig);

  try {
    const response = await axiosInstance.request<R>(requestConfig);
    return response.data as RequestResponse<R>;
  } catch (error) {
    const err = error as ResponseError;
    handleRequestError({
      error: err,
      config: requestConfig,
      onLogout: code => handleLogout(code),
      onMessage: msg => message?.error(msg)
    });
    // logErr(metrics, url, err);
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
