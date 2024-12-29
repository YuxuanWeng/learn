import { useEffect } from 'react';
import { UtilEventEnum } from 'app/types/IPCEvents';

export const useMainGetLocalStorage = () => {
  useEffect(() => {
    const getLocalStorageResult = (key: string | undefined) => {
      if (key) window.Main.sendMessage(UtilEventEnum.GetLocalStorageResult, JSON.stringify(localStorage.getItem(key)));
    };

    const off = window.Main.on(UtilEventEnum.GetLocalStorage, getLocalStorageResult);

    return () => {
      off();
    };
  }, []);
};
