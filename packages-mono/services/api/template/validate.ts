import { TemplateGet } from '@fepkg/services/types/template/get';
import { TemplateSet } from '@fepkg/services/types/template/set';
import { ConfigValidationType, ConfigValue } from '../config/validate';

export type ConfigRedisGetParams<T = ConfigValue> = TemplateGet.Request & {
  /** 校验类型 */
  type: ConfigValidationType<T>;
  /** Config 默认值 */
  defaultValue?: T;
};

export type ConfigRedisSetParams<T = ConfigValue> = Omit<TemplateSet.Request, 'value'> & {
  /** 校验类型 */
  type: ConfigValidationType<T>;
  /** Config 值 */
  value: T;
};
