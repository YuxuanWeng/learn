import { useEffect } from 'react';
import { message } from '@fepkg/components/Message';
import { UtilEventEnum } from 'app/types/IPCEvents';

const handler = errorText => {
  message.error(errorText);
};

export const useMainProcessError = () => {
  useEffect(() => {
    const off = window.Main.on(UtilEventEnum.MainProcessError, handler);

    return () => {
      off();
    };
  }, []);
};
