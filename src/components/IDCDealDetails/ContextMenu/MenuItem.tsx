import { MenuItem as OldMenuItem } from '@fepkg/components/ContextMenu';
import { MenuItemProps } from '@fepkg/components/ContextMenu/types';

export const MenuItem = ({ ...restProps }: MenuItemProps) => {
  return (
    <OldMenuItem
      className="!bg-gray-600 text-gray-000 hover:!bg-gray-500"
      {...restProps}
    />
  );
};
