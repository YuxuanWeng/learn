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
import { getIDCMainDialogConfig } from '@/pages/Spot/utils/openDialog';

export const useOpenSpotPanel = () => {
  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();
  const { access } = useAccess();

  // 如果当前的 productType 是 NCDP，需要转换为 NCD，因为 NCDP 没有能使用导航栏打开的功能
  let targetProductType = productType;
  if (productType === ProductType.NCDP) targetProductType = ProductType.NCD;

  return useMemoizedFn(async (internalCode?: string) => {
    if (!access.has(getOmsAccessCodeEnum(targetProductType, OmsAccessCodeSuffix.SpotPricingPage))) {
      message.error('无成交记录权限，无法跳转');
      return;
    }
    const spotExist = await window.Main.invoke(UtilEventEnum.GetWindowIsExist, WindowName.BNCIdcHome);
    if (spotExist) {
      window.Broadcast.emit(BroadcastChannelEnum.BROADCAST_DEAL_DETAIL_LOCATION, internalCode);
      window.Main.invoke(UtilEventEnum.FocusByWindowName, WindowName.BNCIdcHome);
    } else {
      openDialog(getIDCMainDialogConfig(targetProductType, internalCode));
    }
  });
};
