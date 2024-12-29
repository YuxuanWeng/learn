import { parseJSON } from '@fepkg/common/utils/utils';
import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ConfigGet } from '@fepkg/services/types/config/get';
import { captureMessage } from '@sentry/react';
import { ConfigGetParams, capture, validate } from './validate';

/**
 * @description 获取配置
 * @url /api/v1/bdm/bds/bds_api/config/get
 */
export const fetchConfig = async <T>(params: ConfigGetParams<T>, config?: RequestConfig) => {
  const { type, defaultValue, ...rest } = params;

  let resp: ConfigGet.Response | undefined;

  try {
    resp = await getRequest().post<ConfigGet.Response>(APIs.config.get, rest, config);
  } catch (err) {
    if (!import.meta.env.DEV) captureMessage('Config get uses default value.', { extra: { params, err } });
  }

  // 如果服务端没有存储的值，直接使用默认值
  if (!resp?.value) return defaultValue;

  let valid = validate<T>(type, resp?.value);
  if (!valid) {
    // 如果校验不通过，说明服务端存储的值与预期不符，此时会再校验传入的默认值
    // @ts-ignore
    if (defaultValue !== undefined) valid = validate<T>(type, defaultValue as T);

    // 如果校验还是不通过，说明传入的默认值也与预期不符
    if (!valid) {
      capture('get', params);
      return undefined;
    }

    // 如果因校验不通过而使用默认值，上报错误
    if (!import.meta.env.DEV) captureMessage('Config get uses default value.', { extra: params });
    return defaultValue;
  }

  return parseJSON<T>(resp?.value);
};
