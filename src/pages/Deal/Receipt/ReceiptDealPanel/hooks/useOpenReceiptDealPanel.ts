import { message } from '@fepkg/components/Message';
import { ProductType } from '@fepkg/services/types/bdm-enum';
import { useMemoizedFn } from 'ahooks';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { BroadcastChannelEnum } from 'app/types/broad-cast';
import { WindowName } from 'app/types/window-v2';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { useAccess } from '@/common/providers/AccessProvider';
import { OmsAccessCodeSuffix } from '@/common/types/access';
import { getOmsAccessCodeEnum } from '@/common/utils/access';
import { useProductParams } from '@/layouts/Home/hooks';
import { getReceiptDealPanelConfig } from '@/pages/Deal/Receipt/ReceiptDealPanel/utils';

/**
 * 跳转打开成交单，并内码搜索
 */
export const useOpenReceiptDealPanel = () => {
  const { productType } = useProductParams();
  const { openDialog } = useDialogWindow();
  const { access } = useAccess();

  // 如果当前的 productType 是 NCDP，需要转换为 NCD，因为 NCDP 没有能使用导航栏打开的功能
  let targetProductType = productType;
  if (productType === ProductType.NCDP) targetProductType = ProductType.NCD;

  return useMemoizedFn(async (code?: string) => {
    if (!access.has(getOmsAccessCodeEnum(targetProductType, OmsAccessCodeSuffix.ReceiptDealPage))) {
      message.error('无成交单权限，无法跳转');
      return false;
    }
    const exist = await window.Main.invoke<boolean>(UtilEventEnum.GetWindowIsExist, WindowName.ReceiptDealPanel);
    // 若已打开成交单面板，需进行跳转
    if (exist) {
      if (code) {
        window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_RECEIPT_DEAL_REFRESH, code);
      }
      openDialog(getReceiptDealPanelConfig(targetProductType, code));
      return false;
    }
    // 否则在主页打开成交单面板
    window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_SWITCH_RECEIPT_DEAL, code);
    window.Main.invoke(UtilEventEnum.FocusByWindowName, WindowName.MainHome);
    return true;
  });
};
