import { HTMLProps } from 'react';
import { SizeProps } from '../types';

export type SystemType = 'oms' | 'dtm' | 'odm';

export type LogoProps = Omit<HTMLProps<HTMLSpanElement>, 'size'> & {
  /** 系统类型，默认为 oms */
  system?: SystemType;
  /** 是否展示 uat 标签，默认为 false */
  uat?: boolean;
  /** 版本号 */
  version?: string;
} & SizeProps;
