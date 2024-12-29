import { HTMLAttributes } from 'react';

export type WatermarkOptions = HTMLAttributes<HTMLDivElement> & {
  /** 水印内容，默认为登录用户中文名称 */
  content?: string;
  /** 字体大小，默认为 14 */
  fontSize?: number;
  /** 字体颜色，默认为 white */
  color?: string;
  /** 水印透明度，默认为 0.1 */
  opacity?: number;
};
