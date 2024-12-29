import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ConfigSet } from '@fepkg/services/types/config/set';
import { ConfigSetParams, capture, validate } from './validate';

/**
 * @description 设置配置
 * @url /api/v1/bdm/bds/bds_api/config/set
 */
export const setConfig = async <T>(params: ConfigSetParams<T>, config?: RequestConfig) => {
  const { type, value, ...rest } = params;

  const stringified = JSON.stringify(value);

  const valid = validate<T>(type, stringified);
  if (!valid) {
    capture('set', params);
    return undefined;
  }

  return getRequest().post<ConfigSet.Response>(APIs.config.set, { ...rest, value: stringified }, config);
};
