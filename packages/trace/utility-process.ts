import { initTracer } from '@fepkg/trace';
import { getAppConfig } from 'app/utils/get-app-config';
import { getUploadUrl } from '@packages/utils';

const appConfig = getAppConfig();
const { traceUrl } = getUploadUrl(appConfig);

/** should be called after app is Ready */
export const initNodeTracer = (deviceId: string) => {
  initTracer({
    // exportURL: `${appConfig.apiHost}${appConfig.traceURL ?? ''}`,
    exportURL: traceUrl,
    runtime: 'node',
    meta: {
      serviceName: 'bdm.bds.client',
      serviceVersion: appConfig.version,
      deviceId
      // TODO: add user_id
      // userId: miscStorage.userInfo?.user_id
    }
  });
};
