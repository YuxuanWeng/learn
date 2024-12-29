import { PropsWithChildren } from 'react';

export type DrawerProps = PropsWithChildren<{
  /** container className */
  className?: string;
  /** 点击蒙层是否关闭，默认为 true  */
  maskCloseable?: boolean;
  /** 是否关闭后销毁浮动层，默认为 true */
  destroyOnClose?: boolean;
  /** 是否默认显示（默认为 false） */
  defaultOpen?: boolean;
  /** 是否显示 */
  open?: boolean;
  /** 显示隐藏更改时的回调 */
  onOpenChange?: (val: boolean) => void;
  /** Mask 点击时的回调 */
  onMaskClick?: () => void;
}>;
