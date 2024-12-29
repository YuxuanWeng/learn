import { API_BASE, API_MOCK_HOST } from '@fepkg/request/constants';
import { RequestConfig } from '@fepkg/request/types';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { AppConfig } from 'app/types/app-config';
import { AxiosError } from 'axios';
import { miscStorage } from '@/localdb/miscStorage';
import { isDisplayingLogoutDialog } from '../utils/login';

export const host = '';
const commonBase = import.meta.env.VITE_API_COMMON_BASE;

const omsHostEnvMap = {
  dev: import.meta.env.VITE_DEV_API_HOST,
  test: import.meta.env.VITE_TEST_API_HOST,
  prod: window.appConfig.apiHost
};

const algoHostEnvMap = {
  algo_dev: import.meta.env.VITE_ALGO_DEV_API_HOST,
  algo_test: import.meta.env.VITE_ALGO_TEST_API_HOST,
  algo_prod: window.appConfig.algoHost
};

export const hostEnvMap = { ...omsHostEnvMap, ...algoHostEnvMap };

let versionCode: string;

export const headersMetaInterceptor = async (config: RequestConfig) => {
  if (!versionCode) {
    const appConfig = await window?.Main?.invoke<AppConfig>?.(UtilEventEnum.GetAppConfig);
    versionCode = appConfig?.staticVersion;
  }
  config.headers = {
    'BDM-AUTH-TOKEN': miscStorage.token ?? '',
    'CLIENT-VERSION': versionCode,
    'CLIENT-PLATFORM': window.System?.isMac ? 'MAC' : 'WINDOWS',
    'CLIENT-DEVICE-ID': miscStorage.deviceId ?? '',
    ...config.headers
  };
  if (!config.ignoreFromProductType) {
    let productType: ProductType | undefined;
    if (config.fromProductType) {
      productType = config.fromProductType;
    } else {
      productType = miscStorage.productType;
      // 选中一级时，将与一级无关的接口替换为二级
      if (productType === ProductType.NCDP) {
        productType = ProductType.NCD;
      }
    }
    config.headers['FROM-PRODUCT-TYPE'] = productType ?? '';
  }
  return config;
};

export enum IAxiosErrorType {
  IsLogout = 'Logout'
}

export const basicRequestInterceptor = (config: RequestConfig) => {
  if (isDisplayingLogoutDialog()) {
    return Promise.reject(new AxiosError('already logout', IAxiosErrorType.IsLogout));
  }

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
  const apiEnv = `${config.isAlgo ? 'algo_' : ''}${miscStorage.apiEnv ?? 'dev'}`;

  let requestApiBase = API_BASE;

  const { version = 'v1' } = config;

  // 3. 对auth_api处理：当url以auth_api开头时替换baseURL
  if (config.url?.startsWith('/auth_api')) requestApiBase = `/api/${version}/bdm/base`;

  if (config.isAlgo) {
    requestApiBase = '/api/v1/algo';
  }

  // 4. 对crm的请求特殊处理
  if (config.url?.startsWith('/crm')) requestApiBase = commonBase;

  if (config.isMock) {
    config.baseURL = `${API_MOCK_HOST}${requestApiBase}`;
  } else {
    // 处理dev环境，在apiBase前加上/${apiEnv}，然后由Vite sever进行代理
    if (window.location.host.startsWith('localhost')) {
      config.baseURL = `${host}/${apiEnv}${requestApiBase}`;
    }

    // 处理打包后的baseURL
    if (window.location.href.startsWith('file://')) {
      config.baseURL = `${hostEnvMap[apiEnv]}${requestApiBase}`;
    }
  }
  if (config.isLocalServerRequest) {
    if (!miscStorage.localServerPort) {
      throw new Error('Missing localServerPort!');
    }
    // config.baseURL = 'http://10.8.0.31:9999';
    config.baseURL = `http://localhost:${miscStorage.localServerPort}`;
    config.withCredentials = false;
  }

  return config;
};
