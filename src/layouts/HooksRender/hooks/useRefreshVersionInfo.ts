import { useEffect } from 'react';
import { captureMessage } from '@sentry/react';
import { AutoUpdateEventEnum } from 'app/types/IPCEvents';
import { useSetAtom } from 'jotai';
import { versionInfoAtom } from '@/components/VersionSettings/atoms';

export const useRefreshVersionInfo = () => {
  const setVersionInfo = useSetAtom(versionInfoAtom);

  useEffect(() => {
    const updateVersionInfo = (versionInfoString: string | undefined) => {
      try {
        setVersionInfo(JSON.parse(versionInfoString ?? ''));
      } catch (err) {
        captureMessage('Update version error', { extra: { err } });
      }
    };

    const off = window.Main.on(AutoUpdateEventEnum.RefreshUpdateInfo, updateVersionInfo);

    return () => {
      off();
    };
  }, [setVersionInfo]);
};
