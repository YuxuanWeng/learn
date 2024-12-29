import { ContextMenu as OldContextMenu } from '@fepkg/components/ContextMenu';
import { ContextMenuProps } from '@fepkg/components/ContextMenu/types';

export const ContextMenu = ({ ...restProps }: ContextMenuProps) => {
  return (
    <OldContextMenu
      className="bg-gray-600"
      {...restProps}
    />
  );
};
