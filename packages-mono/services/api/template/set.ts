import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { capture, validate } from '@fepkg/services/api/config/validate';
import { APIs } from '@fepkg/services/apis';
import { TemplateSet } from '@fepkg/services/types/template/set';
import { ConfigRedisSetParams } from './validate';

/**
 * @description 更新模版(redis写入)
 * @url /api/v1/bdm/bds/bds_api/template/set
 */
export const setConfigRedis = async <T>(params: ConfigRedisSetParams<T>, config?: RequestConfig) => {
  const { type, key, value } = params;

  const stringified = JSON.stringify(value);

  const valid = validate<T>(type, stringified);
  if (!valid) {
    capture('set', params);
    return undefined;
  }

  return getRequest().post<TemplateSet.Response>(APIs.template.set, { key, value: stringified }, config);
};
