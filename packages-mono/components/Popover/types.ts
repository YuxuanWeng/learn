import React, { HTMLProps, MouseEventHandler, PropsWithChildren, ReactNode } from 'react';
import { OffsetOptions, Placement, safePolygon } from '@floating-ui/react';

export type PopoverOptions = {
  /** 触发行为（默认为 click） */
  trigger?: 'manual' | 'click' | 'hover';
  /** 引用层的 ref 的属性字段，默认为 ref，在包裹 Radio/Checkbox 时，需要使用 wrapperRef */
  referenceRefField?: string;
  /** 浮动层 props */
  floatingProps?: Omit<HTMLProps<HTMLDivElement>, 'ref'>;
  /** 浮动层渲染根节点 Id */
  floatingId?: string;
  /** 浮动层渲染根节点 */
  floatingRoot?: HTMLElement;
  /** 是否支持聚焦到浮动层，默认为 true */
  floatingFocus?: boolean;
  /** 显示位置（默认为 top-end）  */
  placement?: Placement;
  /** 显示位置距离 */
  offset?: OffsetOptions;
  /** 渲染内容 */
  content?: ReactNode;
  /** 是否展示 Arrow，默认为 true */
  arrow?: boolean;
  /** Arrow样式 */
  arrowStyle?: React.CSSProperties;
  /** 是否在焦点进入 input 后自动关闭浮动层，默认为 true */
  closeOnInput?: boolean;
  /** 是否开启 safePolygon，使得 popover trigger 为 'hover' 时，鼠标能进入 content，默认为 false */
  safePolygon?: boolean | Parameters<typeof safePolygon>[0];
  /** 是否关闭后销毁浮动层，默认为 true */
  destroyOnClose?: boolean;
  /** 是否默认显示（默认为 false） */
  defaultOpen?: boolean;
  /** 是否在打开后更新选项位置，当Popover浮动层不能自动更新位置的时候设为true */
  updateByOpen?: boolean;
  /** 是否显示 */
  open?: boolean;
  /** 显示隐藏更改时的回调 */
  onOpenChange?: (open: boolean) => void;
  /** 点击弹出气泡按钮时的回调 */
  onPopupClick?: MouseEventHandler<HTMLElement>;
};

export type PopoverProps = PropsWithChildren<PopoverOptions>;
