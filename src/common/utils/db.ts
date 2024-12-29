import { miscStorage } from '@/localdb/miscStorage';

export const getDBInitConfig = () => {
  return {
    version: window.appConfig?.version ?? '',
    softLifecycleId: miscStorage.softLifecycleId ?? '',
    platform: window.System?.isMac ? 'MAC' : 'WINDOWS',
    deviceId: miscStorage.deviceId ?? '',
    deviceType: navigator.userAgent
  } as const;
};
