import type { DataLocalizationStatus } from '@fepkg/services/types/data-localization-manual/data-localization-status';
import { DataController } from 'app/packages/data-controller';
import { EventClient } from 'app/packages/event-client';
import {
  DataInitSyncEventMessage,
  DataRealtimeSyncEventMessage,
  EventClientChannel
} from 'app/packages/event-client/types';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { userInitConfigStorage } from 'app/windows/store/user-init-config-storage';
import { v4 } from 'uuid';
import { initNodeTracer } from '@packages/trace/utility-process';
import { PortClient } from './port-client';
import { logError, logger, metrics, postToMain, trackPoint } from './utils';

const eventClient = new EventClient();
const portClient = new PortClient({ eventClient });
let dataController: DataController | undefined;

// 实时同步链路状态变动
eventClient.on<DataRealtimeSyncEventMessage>(EventClientChannel.DataRealtimeSyncStateChange, ctx => {
  const { status, message, logContext, syncDataType } = ctx;
  const id = v4();
  portClient.postToAllRender(DataLocalizationAction.RealtimeSyncStateChange, id, {
    syncDataType,
    status,
    message,
    logContext
  });
});

eventClient.on<DataInitSyncEventMessage>(EventClientChannel.DataInitSyncStateChange, ctx => {
  const { status, progress, message, logContext, syncDataType } = ctx;
  const id = v4();
  portClient.postToAllRender(DataLocalizationAction.InitSyncStateChange, id, {
    syncDataType,
    status,
    progress,
    message,
    logContext
  });
});

process.parentPort.on('message', event => {
  const { action, value } = event.data ?? {};
  switch (action) {
    case DataLocalizationAction.Start: {
      try {
        if (!value) throw new Error('InitConfig is undefined.');
        userInitConfigStorage.setUserInitConfig(value);

        const meta = userInitConfigStorage.getMeta();
        if (meta) {
          metrics.setMeta({ ...meta, uploadUrl: meta.metricsUrl });
          logger.setMeta({ ...meta, uploadUrl: meta.logUrl });
        }

        initNodeTracer(meta?.deviceId ?? '');

        const dbInitConfig = userInitConfigStorage.getDBInitConfig();
        if (!dbInitConfig) throw new Error('dbInitConfig is undefined.');

        dataController = new DataController(dbInitConfig, eventClient);
        dataController?.init();
        portClient.setDataController(dataController);

        trackPoint({ message: 'Data localization process init start.' });
      } catch (error) {
        logError(error, 'Data localization process init error');
      }
      break;
    }
    case DataLocalizationAction.NewPort: {
      try {
        if (!value?.portId) throw new Error('NewPortConfig is undefined.');

        if (Array.isArray(value?.aliveWindows)) {
          portClient.removeSlackPort(value?.aliveWindows);
        }

        portClient.newPort(value.portId, event.ports?.[0]);
      } catch (error) {
        logError(error);
      }
      break;
    }
    case DataLocalizationAction.RemovePort: {
      try {
        if (!value) throw new Error('RemovePortConfig is undefined.');
        portClient.closePort(value.portId);
      } catch (error) {
        logError(error);
      }

      break;
    }
    case DataLocalizationAction.End: {
      try {
        portClient.end();
        dataController?.close();
        dataController = undefined;
      } catch (error) {
        logError(error);
      }
      break;
    }
    case DataLocalizationAction.TokenUpdate: {
      if (value?.token) {
        dataController?.tokenUpdate(value.token);
      }
      break;
    }
    case DataLocalizationAction.GetLocalDataInfo: {
      if (!value) throw new Error('GetLocalDataInfo is undefined.');
      const localDataStatus = dataController?.getLocalDataStatus();
      postToMain<DataLocalizationStatus.Response>({
        action: DataLocalizationAction.GetLocalDataInfo,
        local_request_trace_id: value.local_request_trace_id,
        value: localDataStatus ?? {}
      });
      break;
    }

    default:
      break;
  }
});

export default null;
