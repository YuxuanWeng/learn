import { useEffect } from 'react';
import { LoginEventEnum } from 'app/types/IPCEvents';
import { checkIsHomePage } from '@packages/utils';
import { useWindowName } from '@/common/atoms';
import { showLogoutModal } from '@/common/utils/login';

export const useHomeWindowLogoutListener = () => {
  const windowName = useWindowName();
  useEffect(() => {
    if (checkIsHomePage(windowName)) {
      window.Main.on(LoginEventEnum.RendererBeforeLogout, (text, title, okText) =>
        showLogoutModal(text as string, title as string, okText as string)
      );
    }
    return () => {
      window.Main.remove(LoginEventEnum.RendererBeforeLogout);
    };
  }, [windowName]);
};
