import { VersionInfo, checkVersionDiff } from 'app/utils/check-version';

export const checkVersion = (targetVersionInfo: VersionInfo) => {
  const currentVersion = window.appConfig.version;

  return checkVersionDiff(currentVersion, targetVersionInfo);
};
