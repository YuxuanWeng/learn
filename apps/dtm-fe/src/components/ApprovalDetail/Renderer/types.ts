import { HTMLProps, ReactNode } from 'react';
import { Size } from '@fepkg/components/types';

export declare namespace ApprovalDetailRendererProps {
  export type SmallestText = HTMLProps<HTMLSpanElement> & {
    /** 是否展示 diff 样式 */
    diff?: boolean;
  };

  export type CityText = SmallestText & {
    /** 交易方式 */
    mode?: string;
  };

  export type InstText = SmallestText & {
    /** 是否点亮 nc 标志 */
    nc?: boolean;
    /** 是否点亮代付标志 */
    pf?: boolean;
  };

  export type Code = Omit<HTMLProps<HTMLDivElement>, 'label' | 'size' | 'value'> & {
    /** Item label */
    label?: ReactNode;
    /** Item label className */
    labelCls?: string;
    /** 是否展示 diff 样式 */
    diff?: boolean;
    /** 内容，传递的 children 为 ReactNode 用于 copy */
    content?: string;
  };

  export type Item = Code & {
    /** Item children className */
    childrenCls?: string;
    /** 布局方向，默认为 vertical */
    align?: 'vertical' | 'horizontal';
    /** 文字尺寸，默认为 sm */
    size?: Size;
  };

  export type Row = HTMLProps<HTMLDivElement> & {
    /** 是否为 dashed 边框 */
    dashed?: boolean;
  };
}
