import { KeyboardKeys } from '@fepkg/common/utils/keyboard';
import { ContextMenu, MenuItem as MenuItemComponent, MenuItemProps } from '@fepkg/components/ContextMenu';
import { useAtom, useAtomValue } from 'jotai';
import { useEventListener } from 'usehooks-ts';
import { quoteBatchFormOpenAtom } from '@/pages/Quote/BatchForm/atoms';
import {
  originalTextMdlOpenAtom,
  quoteMdlOpenAtom,
  repeatQuoteMdlOpenAtom,
  settingMdlOpenAtom
} from '@/pages/Quote/Collaborative/atoms/modal';
import { ctxMenuPositionAtom, ctxMenuVisibleAtom } from '@/pages/Quote/Collaborative/atoms/panel';
import { useDraftAction } from '@/pages/Quote/Collaborative/hooks/useDraftAction';
import { useTableState } from '@/pages/Quote/Collaborative/providers/TableStateProvider';

const MenuItem = ({ label, keyboard, ...restProps }: MenuItemProps & { label: string; keyboard?: string }) => {
  return (
    <MenuItemComponent
      className="!w-40"
      {...restProps}
    >
      <span className="flex justify-between items-center">
        <span>{label}</span>
        <span className="text-gray-300">{keyboard}</span>
      </span>
    </MenuItemComponent>
  );
};

export const DraftGroupTableContextMenu = () => {
  const { operable, showIgnore } = useTableState();
  const { copy, confirmMessage, showEditModal, ignore } = useDraftAction();

  const [visible, setVisible] = useAtom(ctxMenuVisibleAtom);
  const position = useAtomValue(ctxMenuPositionAtom);
  const quoteMdlOpen = useAtomValue(quoteMdlOpenAtom);
  const batchQuoteMdlOpen = useAtomValue(quoteBatchFormOpenAtom);
  const settingMdlOpen = useAtomValue(settingMdlOpenAtom);
  const repeatQuoteMdlOpen = useAtomValue(repeatQuoteMdlOpenAtom);
  const originalTextMdlOpen = useAtomValue(originalTextMdlOpenAtom);

  const mdlOpen = quoteMdlOpen || batchQuoteMdlOpen || settingMdlOpen || repeatQuoteMdlOpen || originalTextMdlOpen;

  useEventListener('keydown', evt => {
    const altPress = evt.altKey || evt.metaKey;
    const ctrlPress = evt.ctrlKey || evt.metaKey;

    setVisible(false);

    switch (evt.key.toLowerCase()) {
      case KeyboardKeys.KeyC:
        // 如果查看原文弹窗打开时，不进行快捷键复制
        if (!originalTextMdlOpen) {
          if (ctrlPress) copy();
        }
        break;
      case KeyboardKeys.KeyS:
        if (!operable || mdlOpen) return;
        if (altPress) confirmMessage();
        break;
      case KeyboardKeys.KeyE:
        if (!operable || mdlOpen) return;
        if (altPress) showEditModal();
        break;
      case KeyboardKeys.Delete.toLowerCase():
        if (!operable || mdlOpen) return;
        ignore();
        break;
      default:
        break;
    }
  });

  if (!operable) return null;

  return (
    <ContextMenu
      open={visible}
      position={position}
      onOpenChange={setVisible}
    >
      <MenuItem
        label="修改 Alt+E"
        onClick={() => showEditModal()}
      />
      {showIgnore && (
        <MenuItem
          label="忽略 Delete"
          onClick={() => ignore()}
        />
      )}
      <MenuItem
        label="全部确认 Alt+S"
        onClick={() => confirmMessage()}
      />
    </ContextMenu>
  );
};
