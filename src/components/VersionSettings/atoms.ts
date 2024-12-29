import { useEffect } from 'react';
import { VersionInfo } from 'app/utils/check-version';
import { atom, useSetAtom } from 'jotai';

export const versionInfoAtom = atom<VersionInfo | undefined>(undefined);

const VERSION_POLLING_TIME = 10 * 60 * 1000;
// const VERSION_POLLING_TIME = 1000;

export const useVersionPolling = () => {
  const setVersionInfo = useSetAtom(versionInfoAtom);

  useEffect(() => {
    const updateVersionInfo = async () => {
      const res = (await window.Main.checkUpdate(true))?.updateInfo as VersionInfo | undefined;

      setVersionInfo(res);
    };

    updateVersionInfo();

    const timer = setInterval(() => {
      updateVersionInfo();
    }, VERSION_POLLING_TIME);

    return () => clearInterval(timer);
  }, [setVersionInfo]);
};

export const useUpdateVersionInfo = () => {
  const setVersionInfo = useSetAtom(versionInfoAtom);
  const updateVersionInfo = async () => {
    const res = (await window.Main.checkUpdate(true))?.updateInfo as VersionInfo | undefined;

    setVersionInfo(res);
  };

  return { updateVersionInfo };
};
