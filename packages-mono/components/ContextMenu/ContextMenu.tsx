import { useRef } from 'react';
import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { ControlledMenu } from '@szhsin/react-menu';
import { ContextMenuProps } from './types';
import { useClose } from './useClose';
import { getMenuCls } from './utils';

export const ContextMenu = ({
  open,
  position,
  onOpenChange,
  className,
  closeByKeyboard = KeyboardKeys.Escape,
  // If true, menu is rendered as a direct child of document.body,
  portal = true,
  ...restProps
}: ContextMenuProps) => {
  const ref = useRef(null);
  const { handleClose } = useClose(ref, open, onOpenChange);

  return (
    <ControlledMenu
      ref={ref}
      state={open ? 'open' : 'closed'}
      anchorPoint={position}
      portal={portal}
      menuClassName={getMenuCls(className)}
      containerProps={{ style: { zIndex: 1070 } }}
      submenuOpenDelay={0}
      submenuCloseDelay={0}
      transition={false}
      onKeyDown={evt => {
        if (evt.key === closeByKeyboard) {
          evt.stopPropagation();
          handleClose();
        }
      }}
      onClose={event => {
        if (event.key === KeyboardKeys.Escape) return;

        handleClose();
      }}
      {...restProps}
    />
  );
};
