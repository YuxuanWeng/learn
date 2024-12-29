import { useMemo } from 'react';
import { ContextMenu, MenuItem } from '@fepkg/components/ContextMenu';
import { ReceiptDealStatus } from '@fepkg/services/types/bds-enum';
import { useAtom, useAtomValue } from 'jotai';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { trackPoint } from '@/common/utils/logger/point';
import { useProductParams } from '@/layouts/Home/hooks';
import { ReceiptDealFormMode } from '@/pages/Deal/Receipt/ReceiptDealForm/types';
import { getReceiptDealFormConfig } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';
import { getReceiptDealLogConfig } from '@/pages/Deal/Receipt/ReceiptDealLog/utils';
import {
  receiptDealTableCtxMenuOpenAtom,
  receiptDealTableCtxMenuPositionAtom
} from '@/pages/Deal/Receipt/ReceiptDealPanel/atoms/table';
import { ReceiptDealAction } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealSidebar/constants';
import { useSidebarEvent } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealSidebar/useSidebarEvent';
import { ReceiptDealTrace } from '@/pages/Deal/Receipt/ReceiptDealPanel/components/ReceiptDealTable/types';
import { ReceiptDealContextMenuProps } from './types';

export const ReceiptDealContextMenu = ({ selectedReceiptDealList }: ReceiptDealContextMenuProps) => {
  const { access } = useAccess();
  const { productType } = useProductParams();

  const { openDialog } = useDialogWindow();

  const [open, setOpen] = useAtom(receiptDealTableCtxMenuOpenAtom);
  const position = useAtomValue(receiptDealTableCtxMenuPositionAtom);

  const first = selectedReceiptDealList.at(0);

  const removeBridge = useMemo(() => {
    return (
      selectedReceiptDealList.length >= 2 &&
      selectedReceiptDealList.every(d => {
        const item = d.original;
        return (
          item.bridge_code &&
          item.bridge_code === first?.original?.bridge_code &&
          !item.order_no &&
          item.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDestroyed &&
          item.receipt_deal_status !== ReceiptDealStatus.ReceiptDealDeleted
        );
      })
    );
  }, [selectedReceiptDealList, first]);

  const { onEvent } = useSidebarEvent();

  const accessCache = {
    edit: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.ReceiptDealEdit)),
    log: access?.has(getOmsAccessCodeEnum(productType, OmsAccessCodeSuffix.ReceiptDealLog))
  };

  return (
    <ContextMenu
      open={open}
      position={position}
      onOpenChange={setOpen}
      className="!w-[160px] flex flex-col gap-0.5 !p-1"
    >
      {selectedReceiptDealList.length === 1 ? (
        <>
          <MenuItem
            disabled={!accessCache.edit}
            onClick={() => {
              trackPoint(ReceiptDealTrace.TableCtxMenuEdit);
              openDialog(
                getReceiptDealFormConfig(productType, {
                  mode: ReceiptDealFormMode.Edit,
                  defaultReceiptDeal: first?.original,
                  editable: first?.editable
                })
              );
            }}
          >
            编辑
          </MenuItem>

          <MenuItem
            disabled={!accessCache.edit}
            onClick={() => {
              trackPoint(ReceiptDealTrace.TableCtxMenuJoin);
              openDialog(
                getReceiptDealFormConfig(productType, {
                  mode: ReceiptDealFormMode.Join,
                  defaultReceiptDeal: first?.original,
                  editable: first?.editable
                })
              );
            }}
          >
            join
          </MenuItem>

          <MenuItem
            disabled={!accessCache.log}
            onClick={() => {
              if (!first?.original?.receipt_deal_id) return;
              openDialog(getReceiptDealLogConfig(productType, first.original.receipt_deal_id));
            }}
          >
            操作日志
          </MenuItem>
        </>
      ) : null}
      {removeBridge ? (
        <MenuItem
          disabled={!accessCache.edit}
          onClick={() => {
            onEvent(ReceiptDealAction.DeleteBridge);
          }}
        >
          删桥
        </MenuItem>
      ) : null}
    </ContextMenu>
  );
};
