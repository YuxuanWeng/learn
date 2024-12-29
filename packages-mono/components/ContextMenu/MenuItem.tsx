import { MenuItem as MenuItemInner } from '@szhsin/react-menu';
import { MenuItemProps } from './types';
import { getMenuItemCls } from './utils';

export const MenuItem = ({ className, icon, children, ...restProps }: MenuItemProps) => {
  return (
    <MenuItemInner
      {...restProps}
      className={getMenuItemCls(className)}
    >
      <>
        {icon}
        {children}
      </>
    </MenuItemInner>
  );
};
