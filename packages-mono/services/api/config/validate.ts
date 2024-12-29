import { parseJSON } from '@fepkg/common/utils/utils';
import { ConfigGet } from '@fepkg/services/types/config/get';
import { ConfigSet } from '@fepkg/services/types/config/set';
import { captureMessage } from '@sentry/react';
import { Extras } from '@sentry/types';

export type ConfigValue = string | number | boolean | object;

export type ConfigValidationType<T> = T extends boolean
  ? 'boolean'
  : T extends number
    ? 'number'
    : T extends string
      ? 'string'
      : T extends unknown[]
        ? 'array'
        : 'object';

export type ConfigGetParams<T = ConfigValue> = ConfigGet.Request & {
  /** 校验类型 */
  type: ConfigValidationType<T>;
  /** Config 默认值 */
  defaultValue?: T;
};

export type ConfigSetParams<T = ConfigValue> = Omit<ConfigSet.Request, 'value'> & {
  /** 校验类型 */
  type: ConfigValidationType<T>;
  /** Config 值 */
  value: T;
};

export const validate = <T>(type: ConfigValidationType<T>, value?: string) => {
  if (value === undefined) return false;

  let valid = true;
  const parsed = parseJSON(value);

  switch (type) {
    case 'array':
      if (!Array.isArray(parsed)) valid = false;
      break;
    default:
      if (typeof parsed !== type) valid = false;
      break;
  }

  return valid;
};

export const capture = (type: 'get' | 'set', params: Extras) => {
  const errorMessage = `Config ${type} is invalid.`;
  if (import.meta.env.DEV) throw new Error(`${errorMessage} -> ${JSON.stringify(params)}`);
  else captureMessage(errorMessage, { extra: params });
};
