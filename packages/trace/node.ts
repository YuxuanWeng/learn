import { TraceSource, initTracer } from '@fepkg/trace';
import { getAppConfig } from 'app/utils/get-app-config';
import { getDeviceId } from 'app/windows/listeners/util-listener';
import { getUploadUrl } from '@packages/utils';

const appConfig = getAppConfig();
const { traceUrl } = getUploadUrl(appConfig);

/** should be called after app is Ready */
export const initNodeTracer = () => {
  initTracer({
    // exportURL: `${appConfig.apiHost}${appConfig.traceURL ?? ''}`,
    exportURL: traceUrl,
    runtime: 'node',
    meta: {
      serviceName: 'bdm.bds.client',
      serviceVersion: appConfig.version,
      deviceId: getDeviceId(),
      source: TraceSource.OMS

      // TODO: add user_id and userAccount
      // userId: miscStorage.userInfo?.user_id
      // userAccount: miscStorage.userInfo?.account
    }
  });
};
