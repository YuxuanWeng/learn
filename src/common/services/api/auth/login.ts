import { API_BASE } from '@fepkg/request/constants';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { Login } from '@fepkg/services/types/auth/login';
import { withNewSpan } from '@fepkg/trace';
import request, { apiAlgoBase } from '@/common/request';
import { hostEnvMap } from '@/common/request/interceptors';
import { miscStorage } from '@/localdb/miscStorage';

export const getLoginRequestParamsForMainProcess = (isReLoginAfterResetPassword = false) => {
  const { apiEnv, token, userInfo, productType } = miscStorage;

  if (apiEnv == null) {
    throw new Error('apiEnv should not be null');
  }

  const algoApiEnv = `algo_${apiEnv}`;

  const baseURL = `${hostEnvMap[apiEnv]}${API_BASE}`;
  const authBaseURL = `${hostEnvMap[apiEnv]}/api/v1/bdm/base`;
  const algoBaseURL = `${hostEnvMap[algoApiEnv]}${apiAlgoBase}`;
  const requestParams = {
    token,
    baseURL,
    algoBaseURL,
    authBaseURL,
    userInfo,
    env: apiEnv,
    isReLoginAfterResetPassword,
    websocketHost: window.appConfig.websocketHost,
    deviceType: navigator.userAgent,
    productType
  };

  return requestParams;
};

/**
 * @description 登录
 * @url /api/v1/bdm/base/auth_api/login
 */
export const login = (params: Login.Request, config?: RequestConfig) => {
  return withNewSpan('login', request.post<Login.Response, Login.Request>, APIs.auth.login, params, config);
};
