import { useEffect } from 'react';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { miscStorage } from '@/localdb/miscStorage';

// 允许在主进程更新渲染进程中的userInfo
export const useUpdateUserInfoListener = () => {
  useEffect(() => {
    window.Main.on(UtilEventEnum.UpdateUserInfo, data => {
      if (data != null) {
        miscStorage.userInfo = data;
      }
    });

    return () => {
      window.Main.remove(UtilEventEnum.UpdateUserInfo);
    };
  }, []);
};
