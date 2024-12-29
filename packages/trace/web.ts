import { TraceSource, initTracer } from '@fepkg/trace';
import { UtilEventEnum } from 'app/types/IPCEvents';
import { getUploadUrl } from '@packages/utils';
import { miscStorage } from '@/localdb/miscStorage';

export const initWebTracer = async () => {
  const appConfig = await window?.Main?.invoke?.(UtilEventEnum.GetAppConfig);
  const { traceUrl } = getUploadUrl(appConfig);

  initTracer({
    // exportURL: `${appConfig.apiHost}${appConfig.traceURL ?? ''}`,
    exportURL: traceUrl,
    runtime: 'window',
    meta: {
      serviceName: 'bdm.bds.client',
      serviceVersion: appConfig?.version,
      deviceId: miscStorage.deviceId,
      userId: miscStorage.userInfo?.user_id,
      userAccount: miscStorage.userInfo?.account,
      source: TraceSource.OMS
    }
  });
};
