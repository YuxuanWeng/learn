import { ReactNode } from 'react';
import { IconRightSmall } from '@fepkg/icon-park-react';
import { SubMenu as SubMenuInner } from '@szhsin/react-menu';
import { SubMenuProps } from './types';
import { getMenuCls, getMenuItemCls } from './utils';

const renderSubMenuLabel: ({
  label,
  icon
}: {
  label: SubMenuProps['label'];
  icon?: ReactNode;
}) => SubMenuProps['label'] = ({ label, icon }) => (
  <>
    {label}
    {icon || <IconRightSmall />}
  </>
);

export const SubMenu = ({ label, className, menuClassName, icon, ...restProps }: SubMenuProps) => {
  return (
    <SubMenuInner
      {...restProps}
      label={renderSubMenuLabel({ label, icon })}
      gap={4}
      menuClassName={getMenuCls(menuClassName, true)}
      itemProps={{ className: getMenuItemCls(className) }}
    />
  );
};
