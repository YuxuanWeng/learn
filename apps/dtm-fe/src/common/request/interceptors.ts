import { API_BASE, API_MOCK_HOST } from '@fepkg/request/constants';
import { RequestConfig } from '@fepkg/request/types';
import { AUTH_CACHE_KEY, authCache } from '@/utils/auth';
import { getIsDisplayLogoutModal } from '@/utils/modal';
import { isMac } from '@/utils/platform';
import { RouteUrl } from '@/router/constants';

export const host = '';
const commonBase = import.meta.env.VITE_API_COMMON_BASE;

const isNavigateToLogin = (token?: string) => {
  const isInLogout = getIsDisplayLogoutModal();

  // 非登录页无token，切未弹窗时需要跳转
  return !token && window.location.pathname !== RouteUrl.Login && !isInLogout;
};

export const headersMetaInterceptor = async (config: RequestConfig) => {
  const token = authCache.get(AUTH_CACHE_KEY)?.token;

  if (isNavigateToLogin(token)) {
    window.location.href = encodeURI(`${window.location.origin}/login`);
  }

  config.headers = {
    ...config.headers,
    'BDM-AUTH-TOKEN': token ?? '',
    'CLIENT-VERSION': __APP_VERSION__,
    'CLIENT-PLATFORM': isMac() ? 'MAC' : 'WINDOWS'
    // 'CLIENT-DEVICE-ID': __APP_DEVICE_ID__
  };

  return config;
};

export const basicRequestInterceptor = (config: RequestConfig) => {
  // 1. axios 的 GET 请求，不会对 [] 等特殊字符转码
  if (config?.method?.toUpperCase() === 'GET' && config.params) {
    let url = config?.url;
    url += '?';
    for (const key of Object.keys(config.params)) {
      url += `${key}=${encodeURIComponent(config.params[key])}&`;
    }
    config.url = url?.substring(0, url.length - 1);
    config.params = {};
  }

  // 2. 处理baseURL
  // 允许在运行时切换环境
  const apiEnv = `${config.isAlgo ? 'algo_' : ''}${__API_ENV__ ?? 'dev'}`;

  let requestApiBase = API_BASE;

  const { version = 'v1' } = config;

  // 3. 对auth_api处理：当url以auth_api开头时替换baseURL
  if (config.url?.startsWith('/auth_api')) requestApiBase = `/api/${version}/bdm/base`;

  if (config.isAlgo) requestApiBase = '/api/v1/algo';

  // 4. 对crm的请求特殊处理
  if (config.url?.startsWith('/crm')) requestApiBase = commonBase;

  if (config.isMock) {
    config.baseURL = `${API_MOCK_HOST}${requestApiBase}`;
  } else {
    // 处理dev环境，在apiBase前加上/${apiEnv}，然后由Vite sever进行代理
    if (window.location.host.startsWith('localhost')) {
      config.baseURL = `${host}/${apiEnv}${requestApiBase}`;
    }

    if (import.meta.env.PROD) {
      // 处理打包后的baseURL
      config.baseURL = requestApiBase;
    }
  }

  return config;
};
