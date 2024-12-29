import { LOGGER_URL, METRICS_URL, TRACE_URL } from '@fepkg/business/constants/upload-url';
import { AppEnv } from '@fepkg/common/types';
import { AppConfig } from 'app/types/app-config';
import { WindowName } from 'app/types/window-v2';

const hostMap = {
  test: 'https://api-test.zoople.cn',
  dev: 'https://api-dev.zoople.cn'
};

/** 检测当前窗口name是否为首页窗口 */
export const checkIsHomePage = (name: string) => {
  return !name ? false : name === WindowName.MainHome;
};

/** 检测当前窗口是否为行情看板 */
export const checkIsProductPanel = (name?: string) => name?.startsWith(WindowName.ProductPanel);

/** 检测当前窗口是否为首页或行情看板 */
export const checkIsHomeOrProductPanel = (name: string) => {
  const isHome = name === WindowName.MainHome;
  const isProductPanel = name.startsWith(WindowName.ProductPanel);
  return isHome || isProductPanel;
};

/** 传入appConfig，获取trace和metrics完整的上传路径，appConfig中的env与缓存中env有不一致的场景，这时以缓存中的为准 */
export const getUploadUrl = (appConfig: AppConfig, apiEnv?: AppEnv) => {
  let metricsUrl = '';
  let traceUrl = '';
  let logUrl = '';
  const { env: configEnv, apiHost } = appConfig;
  const env = apiEnv || configEnv;

  // 当前的uat仅有xintang-uat，但xintang和xintang-uat都对应了prod
  if (env === 'prod') {
    metricsUrl = `${apiHost}${METRICS_URL}`;
    traceUrl = `${apiHost}${TRACE_URL}`;
    logUrl = `${apiHost}${LOGGER_URL}`;
  } else {
    metricsUrl = `${hostMap[env]}${METRICS_URL}`;
    traceUrl = `${hostMap[env]}${TRACE_URL}`;
    logUrl = `${hostMap[env]}${LOGGER_URL}`;
  }

  return { metricsUrl, traceUrl, logUrl };
};
