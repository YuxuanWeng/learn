import { ReactNode } from 'react';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { IconNewWindow } from '@fepkg/icon-park-react';
import { NAVIGATOR_MORE_ID } from './constants';
import { useNavigator } from './providers/NavigatorProvider';
import { NavigatorContextMenuItemId, NavigatorItemId } from './types';

export const NavigatorContextMenu = () => {
  const { ctxMenuState, updateCtxMenuState, handleCtxMenuItemClick } = useNavigator();

  let node: ReactNode;

  switch (ctxMenuState.targetId) {
    case NavigatorItemId.ReceiptDeal:
      node = (
        <MenuItem
          className="gap-2 w-[134px] !h-8 text-gray-000"
          icon={<IconNewWindow size={16} />}
          onClick={() => handleCtxMenuItemClick(NavigatorContextMenuItemId.ReceiptDealDialog)}
        >
          打开独立窗口
        </MenuItem>
      );
      break;
    default:
      break;
  }

  return (
    <ContextMenu
      open={ctxMenuState.open}
      position={ctxMenuState.position}
      className="!p-[7px]"
      portal={{ target: document.querySelector(`#${NAVIGATOR_MORE_ID}`) ?? document.body }}
      onOpenChange={val => {
        updateCtxMenuState(draft => {
          draft.open = val;
          if (!val) {
            draft.position = { x: 0, y: 0 };
            draft.targetId = undefined;
          }
        });
      }}
    >
      {node}
    </ContextMenu>
  );
};
