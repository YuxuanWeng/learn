import { useEffect } from 'react';
import { hasModalVisible } from '@fepkg/common/hooks';
import { UserHotkeyFunction } from '@fepkg/services/types/enum';
import { WindowName } from 'app/types/window-v2';
import { checkIsHomePage, checkIsProductPanel } from '@packages/utils';
import { useWindowName } from '@/common/atoms';
import { useDialogWindow } from '@/common/hooks/useDialog';
import { userHotkeyManager } from '@/common/utils/hotkey';
import { showEditPassword } from '@/components/AccountSafe/EditPassword';
import { useProductParams } from '@/layouts/Home/hooks';
import { miscStorage } from '@/localdb/miscStorage';
import { getCalculatorWindowConfig } from '@/pages/Base/Calculator/utils';

export const useWindowHotkeyRegistration = () => {
  const windowName = useWindowName();
  const { openDialog } = useDialogWindow();
  const { productType } = useProductParams();

  useEffect(() => {
    const beforeOpenCalcDialogByHotkey = () => {
      if (hasModalVisible()) return;
      openDialog(getCalculatorWindowConfig(productType));
    };

    if (checkIsHomePage(windowName) || checkIsProductPanel(windowName)) {
      userHotkeyManager.register(UserHotkeyFunction.UserHotkeyBondCalculator, beforeOpenCalcDialogByHotkey);
    }

    if (miscStorage.userInfo?.is_password_reset && windowName === WindowName.MainHome) {
      showEditPassword(true);
    }
  }, [openDialog, windowName, productType]);
};
