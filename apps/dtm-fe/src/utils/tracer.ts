import { TRACE_URL } from '@fepkg/business/constants/upload-url';
import { initTracer } from '@fepkg/trace';

export const initWebTracer = async () => {
  initTracer({
    exportURL: TRACE_URL,
    runtime: 'window',
    meta: {
      serviceName: 'bdm.dtm.client',
      serviceVersion: __APP_VERSION__
      // serviceVersion: appConfig?.version,
      // deviceId: miscStorage.deviceId,
      // userId: miscStorage.userInfo?.user_id
    }
  });
};
