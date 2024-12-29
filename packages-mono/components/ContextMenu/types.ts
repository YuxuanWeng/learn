import { ReactNode } from 'react';
import { PopoverPosition } from '@fepkg/common/types';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import {
  ControlledMenuProps,
  MenuItemProps as ReactMenuItemProps,
  SubMenuProps as ReactSubMenuProps
} from '@szhsin/react-menu';

export type ContextMenuProps = Omit<ControlledMenuProps, 'position' | 'onClose'> & {
  /** ContextMenu className */
  className?: string;
  /** ContextMenu 是否打开 */
  open?: boolean;
  /** ContextMenu 位置 */
  position?: PopoverPosition;
  /** 通过某个按键关闭 ContextMenu，默认为 Escape，如为 null，则不允许 */
  closeByKeyboard?: KeyboardKeys | null;
  /** ContextMenu 打开/关闭时的回调 */
  onOpenChange?: (open: boolean) => void;
};

export type SubMenuProps = Omit<ReactSubMenuProps, 'className'> & {
  /** SubMenu className */
  className?: string;
  /** SubMenu icon */
  icon?: ReactNode;
  /** SubMenu menuClassName */
  menuClassName?: string;
};

export type MenuItemProps = Omit<ReactMenuItemProps, 'className' | 'icon'> & {
  /** MenuItem className */
  className?: string;
  /** MenuItem Icon */
  icon?: ReactNode;
};
