import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { message } from '@fepkg/components/Message';
import { useAtom, useAtomValue } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { useProductParams } from '@/layouts/Home/hooks';
import { getNCDPLogConfig } from '@/pages/NCDP/NCDPOperationLog/utils';
import { tableCtxMenuOpenAtom, tableCtxMenuPositionAtom } from '@/pages/ProductPanel/atoms/table';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { ProductPanelTableKey } from '@/pages/ProductPanel/types';
import { NCDContextMenuProps } from './types';

export const NCDPContextMenu = ({ selectedNCDPList, referred }: NCDContextMenuProps) => {
  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();
  const { accessCache } = useProductPanel();

  const [open, setOpen] = useAtom(tableCtxMenuOpenAtom);
  const position = useAtomValue(tableCtxMenuPositionAtom);

  const handleLogDlgShow = () => {
    if (!beforeOpenDialogWindow()) return;
    if (!selectedNCDPList.length) {
      message.error('请至少选中一条要操作的数据');
      return;
    }

    if (selectedNCDPList.length > 1) {
      message.error('只能选中一条要操作的数据');
      return;
    }

    openDialog(
      getNCDPLogConfig(
        selectedNCDPList[0].ncdp_id,
        String(productType),
        referred ? ProductPanelTableKey.Referred : ProductPanelTableKey.Basic
      )
    );
  };

  return (
    <ContextMenu
      open={open}
      position={position}
      onOpenChange={setOpen}
    >
      <MenuItem
        disabled={!accessCache.log}
        onClick={handleLogDlgShow}
      >
        报价日志
      </MenuItem>
    </ContextMenu>
  );
};
