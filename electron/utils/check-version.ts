export enum CheckVersionResult {
  // 最新版本
  Latest = 'latest',
  // 旧版本，但不强制更新
  CanUpdate = 'canUpdate',
  // 强制更新
  ForceUpdate = 'forceUpdate',
  // 回退版本
  Rollback = 'rollback'
}

export type VersionInfo = {
  version: string;
  path: string;
  sha512: string;
  releaseDate: string;
  isForce?: boolean;
};

const versionCodeRegToValue = (reg: RegExpMatchArray) => {
  return reg.reduce((sum, cur, index) => {
    if (index === 0) return sum;

    return sum + Number(cur) * 10 ** (2 * (3 - index));
  }, 0);
};

export const checkLowerThanMinVersion = (currentVersion: string, minVersionInfo?: VersionInfo) => {
  if (minVersionInfo == null) return false;

  const minVersion = minVersionInfo.version;

  const versionReg = /^(\d+)\.(\d+).(\d+)$/;

  const curMatch = currentVersion.match(versionReg);
  const minMatch = minVersion.match(versionReg);

  if (curMatch == null || minMatch == null) {
    return false;
  }

  return versionCodeRegToValue(curMatch) < versionCodeRegToValue(minMatch);
};

export const checkVersionDiff = (currentVersion: string, targetVersionInfo?: VersionInfo) => {
  if (targetVersionInfo == null) return CheckVersionResult.Latest;

  const targetVersion = targetVersionInfo.version;

  const versionReg = /^(\d+)\.(\d+).(\d+)$/;

  const curMatch = currentVersion.match(versionReg);
  const targetMatch = targetVersion.match(versionReg);

  const updateResult = targetVersionInfo.isForce ? CheckVersionResult.ForceUpdate : CheckVersionResult.CanUpdate;

  if (curMatch == null && targetMatch == null) {
    return currentVersion === targetVersion ? CheckVersionResult.Latest : updateResult;
  }

  if (curMatch == null && targetMatch != null) {
    return updateResult;
  }

  if (curMatch != null && targetMatch == null) {
    return CheckVersionResult.Latest;
  }

  const curVersionValue = versionCodeRegToValue(curMatch!);
  const targetVersionValue = versionCodeRegToValue(targetMatch!);

  if (curVersionValue > targetVersionValue) return CheckVersionResult.Rollback;

  if (curVersionValue === targetVersionValue) return CheckVersionResult.Latest;

  if (targetVersionInfo.isForce) {
    return CheckVersionResult.ForceUpdate;
  }

  return CheckVersionResult.CanUpdate;
};
