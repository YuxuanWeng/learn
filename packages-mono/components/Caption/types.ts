import { HTMLProps, PropsWithChildren, ReactNode } from 'react';
import { Size } from '../types';

export type CaptionProps = Omit<HTMLProps<HTMLDivElement>, 'ref' | 'size'> &
  PropsWithChildren<{
    /** Caption 字体大小，默认为 sm(13px) */
    size?: Size;
    /** 菱形图标，默认颜色为 primary */
    type?: 'primary' | 'secondary' | 'orange' | 'danger';
    /** 子组件样式 */
    childrenCls?: string;
    /** Icon */
    icon?: ReactNode;
  }>;
