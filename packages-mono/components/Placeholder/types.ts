import { ReactNode } from 'react';
import { Size } from '../types';

export type PlaceholderProps = {
  /** 空状态类型 */
  type: 'loading' | 'no-search-result' | 'no-network' | 'no-setting' | 'no-data';
  /** 空状态尺寸，默认为 sm，md = 200px，sm = 160px，xs = 100px */
  size?: Size;
  /** 空状态文本配置，默认使用相应类型文本配置 */
  label?: ReactNode;
  /** className */
  className?: string;
};
