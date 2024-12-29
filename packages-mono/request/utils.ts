import { RequestConfig, RequestParams, RequestResponse, StatusCode } from '@fepkg/request/types';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';

const PARAM_METHODS = new Set(['GET', 'DELETE', 'HEAD', 'OPTIONS']);

export function transformConfigByMethod(params: RequestParams, config: RequestConfig): RequestConfig {
  const { method = 'GET' } = config;
  const props = PARAM_METHODS.has(method.toLocaleUpperCase()) ? 'params' : 'data';
  const newConfig = { ...config };
  newConfig[props] = params;
  return newConfig;
}

type RequestErrorHandlerParams = {
  error: any;
  config?: RequestConfig;
  onLogout?: (code: StatusCode) => void;
  onMessage?: (message: string, code?: number, type?: 'err' | 'warn') => void;
  /** 业务逻辑的错误处理，若返回 true，不会再继续往下走 */
  onBusiness?: (response: AxiosResponse<RequestResponse>) => boolean;
  /** 默认的预期外的错误处理回调方法-默认不处理预期外的错误 */
  defaultHandler?: () => void;
};

export const handleRequestError = ({
  error,
  config,
  onLogout,
  onMessage,
  onBusiness,
  defaultHandler
}: RequestErrorHandlerParams) => {
  // 被捕获的 Error 可能为：
  // 1、后端返回 200 但是 status_code 不为 0 的错误，error 是一个 AxiosResponse
  // 2、后端返回错误请求，有相应体，error 是一个 AxiosError
  // 3、后端未能返回或未能正常返回对应相应体

  let response: AxiosResponse<RequestResponse> | undefined;

  // 情况 1
  if ((error as AxiosResponse).data != null) {
    response = error;
  }

  // 情况 2
  if ((error as AxiosError).response?.data != null) {
    response = (error as AxiosError<RequestResponse>).response;
  }

  // 情况 1、2
  if (response?.data.base_response != null) {
    const code = response.data.base_response?.code;

    if (code != null) {
      if (
        [
          StatusCode.NotLogin,
          StatusCode.NoAccess,
          StatusCode.NoSystemAccess,
          StatusCode.UserTokenInvalid,
          StatusCode.UserAccountLocked,
          StatusCode.UserAccountDisabled,
          StatusCode.UserTokenIsReplaced,
          StatusCode.UserAccountQuit,
          StatusCode.AdminUserNotFound
        ].includes(code)
      ) {
        onLogout?.(code);
        return;
      }
    }

    if (onBusiness?.(response)) return;

    if (!config?.hideErrorMessage) {
      onMessage?.(error.data?.base_response?.msg ?? '网络异常！请检查你的网络设置！', code);
    }

    return;
  }

  if (config?.hideErrorMessage) return;
  if (axios.isCancel(error)) return;

  // 情况 3
  // 如果把toast放在这里，因为有接口轮询，所以这条toast会跟着轮询不停的出现，需求中toast只需要出现一次
  // 将该toast迁移到v2/AppBar中
  // messageCallback?.('网络异常！请检查你的网络设置！', code, 'warn');
  defaultHandler?.();
};
