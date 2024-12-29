import { parseJSON } from '@fepkg/common/utils/utils';
import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { capture, validate } from '@fepkg/services/api/config/validate';
import { APIs } from '@fepkg/services/apis';
import { TemplateGet } from '@fepkg/services/types/template/get';
import { captureMessage } from '@sentry/react';
import { ConfigRedisGetParams } from './validate';

/**
 * @description 获取模版(redis读取)，慎用，会有丢数据无法恢复的风险
 *
 * 目前使用的地方有：
 * - DTM 导出模板配置
 * - DTM 用户已选择模板
 * @url /api/v1/bdm/bds/bds_api/template/get
 */
export const fetchConfigRedis = async <T>(params: ConfigRedisGetParams<T>, config?: RequestConfig) => {
  const { type, defaultValue, ...rest } = params;

  let resp: TemplateGet.Response | undefined;

  try {
    resp = await getRequest().post<TemplateGet.Response>(APIs.template.get, rest, config);
  } catch (err) {
    if (!import.meta.env.DEV) captureMessage('Config redis get uses default value.', { extra: { params, err } });
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
    if (!import.meta.env.DEV) captureMessage('Config redis get uses default value.', { extra: params });
    return defaultValue;
  }

  return parseJSON<T>(resp?.value);
};
