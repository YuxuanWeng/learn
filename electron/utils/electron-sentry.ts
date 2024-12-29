import * as Sentry from '@sentry/electron';
import { omsApp } from '../models/oms-application';

// const dsn = 'http://ed7a88d960894d2caeab0913dfe685eb@sentry.dev.zoople.cn/3';
const dsn = 'https://fef184d00081f36f33af2997fb07f7dd@o4503973927190528.ingest.sentry.io/4505922989522944';

export function initSentry(softLifecycleId: string) {
  const { appConfig } = omsApp;

  Sentry.init({
    dsn,
    // 这里表示采样率，为了性能考虑上线后也可以改成一定比例进行上报
    tracesSampleRate: 1,
    environment: appConfig.env
    // release: `oms-react-${window.appConfig.env}@${window.appConfig.version}`,
    // 先用短 hash，后续再加入其他信息
    // release: appConfig.shortHash
  });
  Sentry.setTag('traceId', softLifecycleId);
}

export const setSentryDeviceId = (deviceId: string) => {
  Sentry.setTag('deviceId', deviceId);
};
