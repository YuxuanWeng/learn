import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { message } from '@fepkg/components/Message';
import { OperationType as SystemOperationType } from '@fepkg/services/types/enum';
import { useAtom, useAtomValue } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import useOnlineOpenDialog from '@/common/hooks/useOnlineOpenDialog';
import { mulUpdateMarketDealWithUndo } from '@/common/undo-services';
import { OperationType } from '@/common/undo-services/types';
import { trackPoint } from '@/common/utils/logger/point';
import { useProductParams } from '@/layouts/Home/hooks';
import { getDealLogDialogConfig } from '@/pages/Deal/Market/MarketDealLog/dialog';
import { tableCtxMenuOpenAtom, tableCtxMenuPositionAtom } from '@/pages/ProductPanel/atoms/table';
import { useProductPanel } from '@/pages/ProductPanel/providers/PanelProvider';
import { DealTrace } from '../ShortcutSidebar/useDealShortcutEvent';
import { DealContextMenuProps } from './types';

export const DealContextMenu = ({ selectedMarketDealList }: DealContextMenuProps) => {
  const { productType } = useProductParams();
  const { accessCache } = useProductPanel();

  const { beforeOpenDialogWindow } = useOnlineOpenDialog();
  const { openDialog } = useDialogWindow();

  const [open, setOpen] = useAtom(tableCtxMenuOpenAtom);
  const position = useAtomValue(tableCtxMenuPositionAtom);

  const handleMarketLog = () => {
    if (!beforeOpenDialogWindow()) return;
    if (!selectedMarketDealList.length) {
      message.error('请至少选中一条要操作的数据');
      return;
    }
    if (selectedMarketDealList.length > 1) {
      message.error('只能选中一条要操作的数据');
      return;
    }

    trackPoint(DealTrace.SidebarShortcut);

    const config = getDealLogDialogConfig(productType, {
      marketDealId: selectedMarketDealList[0].deal_id
    });
    openDialog(config, { showOfflineMsg: false });
  };

  const handleND = () => {
    if (!selectedMarketDealList.length) {
      message.error('请至少选中一条要操作的数据');
      return;
    }
    const ndMarketDealList = selectedMarketDealList.filter(d => !d?.nothing_done);
    if (!ndMarketDealList.length) {
      message.error('没有可以Nothing Done的数据');
      return;
    }

    trackPoint(DealTrace.SidebarShortcut);

    const params = {
      market_deal_update_list: ndMarketDealList.map(d => {
        return { deal_id: d.deal_id, nothing_done: true };
      }),
      operation_info: { operation_type: SystemOperationType.BondDealUpdateDealInfo }
    };
    mulUpdateMarketDealWithUndo(params, {
      isUndo: true,
      origin: ndMarketDealList,
      productType,
      type: OperationType.Update
    });
  };

  return (
    <ContextMenu
      open={open}
      position={position}
      onOpenChange={setOpen}
      className="!w-[160px] flex flex-col gap-0.5 !p-1"
    >
      <MenuItem
        disabled={!accessCache.log}
        onClick={handleMarketLog}
      >
        成交日志
      </MenuItem>
      <MenuItem
        disabled={!accessCache.deal}
        onClick={handleND}
      >
        Nothing Done
      </MenuItem>
    </ContextMenu>
  );
};
