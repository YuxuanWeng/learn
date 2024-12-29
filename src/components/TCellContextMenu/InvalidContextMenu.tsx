import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { message } from '@fepkg/components/Message';
import { useAtom, useAtomValue } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { useProductParams } from '@/layouts/Home/hooks';
import { tableCtxMenuOpenAtom, tableCtxMenuPositionAtom } from '@/pages/ProductPanel/atoms/table';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { getQuoteLogDialogConfig } from '@/pages/Quote/QuoteLog/dialog';
import { InvalidContextMenuProps } from './types';

export const InvalidContextMenu = ({ selectedQuoteList }: InvalidContextMenuProps) => {
  const { productType } = useProductParams();
  const { accessCache } = useProductPanel();

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  const [open, setOpen] = useAtom(tableCtxMenuOpenAtom);
  const position = useAtomValue(tableCtxMenuPositionAtom);

  const handleQuoteLog = () => {
    if (!beforeOpenDialogWindow()) return;
    if (!selectedQuoteList.length) {
      message.error('请至少选中一条要操作的数据');
      return;
    }

    if (selectedQuoteList.length > 1) {
      message.error('只能选中一条要操作的数据');
      return;
    }

    const config = getQuoteLogDialogConfig(productType, { quoteId: selectedQuoteList[0].quote_id });
    openDialog(config, { showOfflineMsg: false });
  };

  return (
    <ContextMenu
      open={open}
      position={position}
      onOpenChange={setOpen}
    >
      <MenuItem
        disabled={!accessCache.log}
        onClick={handleQuoteLog}
      >
        报价日志
      </MenuItem>
    </ContextMenu>
  );
};
