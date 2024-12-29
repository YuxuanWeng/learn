import axios from 'axios';
import { autoUpdater } from 'electron-updater';
import { omsApp } from '../models/oms-application';
import { CheckVersionResult, checkLowerThanMinVersion, checkVersionDiff } from './check-version';
import { getLocalStorage } from './get-local-storage';
import { isMac } from './utools';

const { appConfig } = omsApp;

export const ossBaseURL = appConfig.ossHost;

const getOssPrefix = () => {
  const companyPrefix = appConfig.channel ? `${appConfig.channel}-dist/` : '';

  const envSuffix = appConfig.env === 'test' ? '' : `_${appConfig.env}`;

  return `${companyPrefix}dist${envSuffix}`;
};

export const packageOSSPath = getOssPrefix();

const getKeySuffix = () => {
  const company = appConfig.channel === '' || appConfig.channel == null ? '' : `__${appConfig.channel}`;

  return `${company}`;
};

// 修改某些 autoUpdater 内的实现
export const patchAutoUpdater = () => {
  const updater = autoUpdater as any;

  updater.setFeedURL(`${ossBaseURL}/${packageOSSPath}`);

  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.autoDownload = false;

  if (isMac) {
    autoUpdater.isUpdaterActive = () => false;
  }

  updater.isUpdateAvailable = (updateInfo: any) => {
    return checkVersionDiff(appConfig.version, updateInfo) !== CheckVersionResult.Latest;
  };

  const oldGetUpdateInfoAndProvider = updater.getUpdateInfoAndProvider;

  updater.getUpdateInfoAndProvider = async () => {
    const res = await oldGetUpdateInfoAndProvider.call(autoUpdater);

    const baseURL = 'https://api.zoople.cn';

    const url = `${baseURL}/api/v1/bdm/base/api/config/get`;

    const namespace = 'bds_client';

    const latestKey = `auto-update-version-latest__${appConfig.env}${getKeySuffix()}`;

    const pmKey = `auto-update-version-pm__${appConfig.env}${getKeySuffix()}`;
    const minVersionKey = `auto-update-min-version__${appConfig.env}${getKeySuffix()}`;

    const pmUsersKey = `auto-update-pm-users__${appConfig.env}${getKeySuffix()}`;

    const users: string[] = JSON.parse((await axios.post(url, { namespace, key: pmUsersKey })).data.value || '[]');

    let userId: string | undefined;

    const userInfoString = await getLocalStorage('userInfo');

    try {
      userId = JSON.parse(userInfoString).user_id;
    } catch (e) {
      console.log(e);
    }

    const latestInfo = JSON.parse((await axios.post(url, { namespace, key: latestKey })).data.value || 'null');

    const pmVersionInfo = JSON.parse((await axios.post(url, { namespace, key: pmKey })).data.value || 'null');

    const minVersionInfo = JSON.parse((await axios.post(url, { namespace, key: minVersionKey })).data.value || 'null');

    const info = userId != null && users.includes(userId) && pmVersionInfo != null ? pmVersionInfo : latestInfo;

    const isLowerThanMin = checkLowerThanMinVersion(appConfig.version, minVersionInfo);

    if (info)
      return {
        ...res,
        info: {
          ...info,
          isForce: info?.isForce || isLowerThanMin
        }
      };

    if (isLowerThanMin) {
      return {
        ...res,
        info: {
          ...minVersionInfo,
          isForce: true
        }
      };
    }

    return {
      ...res,
      info: {
        ...res.info,
        version: appConfig.version
      }
    };
  };
};
