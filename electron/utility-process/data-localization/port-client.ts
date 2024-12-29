import { StatusCode } from '@fepkg/request/types';
import { withNewSpan } from '@fepkg/trace';
import { DataController } from 'app/packages/data-controller';
import { EventClient } from 'app/packages/event-client';
import { DataLocalizationAction, DataLocalizationUtilityProcessEvent } from 'app/types/DataLocalization';
import { QuoteSearchByIdRequestHandler } from 'app/utility-process/data-localization/request-handler/handlers/quote-search-by-id';
import { BaseRequestHandler } from './request-handler/base';
import { AvailableServicesRequestHandler } from './request-handler/handlers/available-service-list';
import { BondGetByKeyMarketListRequestHandler } from './request-handler/handlers/bond-get-by-key-market-list';
import { BondSearchRequestHandler } from './request-handler/handlers/bond-search';
import { DealRecordListRequestHandler } from './request-handler/handlers/deal-record-list';
import { FuzzySearchRequestHandler } from './request-handler/handlers/fuzzy-search';
import { InstSearchRequestHandler } from './request-handler/handlers/inst-search';
import { InstTraderListRequestHandler } from './request-handler/handlers/inst-trader-list';
import { QuoteDraftMessageListRequestHandler } from './request-handler/handlers/quote-draft-message-list';
import { QuoteSearchByKeyMarketRequestHandler } from './request-handler/handlers/quote-search-by-key-market';
import { QuoteSearchOptimalByKeyMarketRequestHandler } from './request-handler/handlers/quote-search-optimal-by-key-market';
import { RestartServicesRequestHandler } from './request-handler/handlers/restart-services';
import { TraderGetByIdListRequestHandler } from './request-handler/handlers/trader-get-by-id-list';
import { TraderSearchRequestHandler } from './request-handler/handlers/trader-search';
import { UserSearchRequestHandler } from './request-handler/handlers/user-search';
import { LiveRequestHandler } from './request-handler/live';
import { logError, logger } from './utils';

interface PortClientConfig {
  dataController?: DataController;
  eventClient: EventClient;
}

export class PortClient {
  private portMap: Map<number, Electron.MessagePortMain> = new Map<number, Electron.MessagePortMain>();

  private eventClient: EventClient;

  private eventHandlerMap: Map<DataLocalizationAction, object> = new Map<DataLocalizationAction, object>();

  constructor(config: PortClientConfig) {
    this.eventClient = config.eventClient;
    if (config.dataController) {
      this.setDataController(config.dataController);
    }
  }

  setDataController(dataController: DataController) {
    const commonConfig = {
      eventClient: this.eventClient,
      dataController,
      getPostToRenderFn: this.getPostToRenderFn.bind(this)
    };
    this.eventHandlerMap.clear();
    [
      new UserSearchRequestHandler(commonConfig),
      new TraderSearchRequestHandler(commonConfig),
      new InstSearchRequestHandler(commonConfig),
      new BondSearchRequestHandler(commonConfig),
      new InstTraderListRequestHandler(commonConfig),
      new FuzzySearchRequestHandler(commonConfig),
      new QuoteSearchByKeyMarketRequestHandler(commonConfig),
      new QuoteSearchOptimalByKeyMarketRequestHandler(commonConfig),
      new QuoteSearchByIdRequestHandler(commonConfig),
      new QuoteDraftMessageListRequestHandler(commonConfig),
      new DealRecordListRequestHandler(commonConfig),
      new BondGetByKeyMarketListRequestHandler(commonConfig),
      new TraderGetByIdListRequestHandler(commonConfig),
      new AvailableServicesRequestHandler(commonConfig),
      new RestartServicesRequestHandler(commonConfig)
    ].forEach(handler => {
      this.eventHandlerMap.set(handler.getAction(), handler);
    });
  }

  getEventHandler(action: DataLocalizationAction) {
    return this.eventHandlerMap.get(action);
  }

  getPortMap() {
    return this.portMap;
  }

  private getAllPortIDList() {
    return [...this.portMap.keys()];
  }

  newPort(portId: number, port: Electron.MessagePortMain) {
    logger.w(
      {
        keyword: '新建port',
        portId
      },
      { immediate: true }
    );
    port.start();
    port.addListener('message', (event: DataLocalizationUtilityProcessEvent) => {
      logger.w(
        {
          keyword: '主进程收到消息',
          message: event.data.action,
          portId,
          localRequestTraceId: event?.data?.local_request_trace_id
        },
        { immediate: true }
      );
      const data = event.data ?? {};
      const eventHandler = this.eventHandlerMap.get(data.action);
      if (!eventHandler) {
        logger.e(
          {
            keyword: '没找到handler',
            message: event.data.action,
            portId,
            localRequestTraceId: event?.data?.local_request_trace_id
          },
          { immediate: true }
        );
        this.getPostToRenderFn(portId)(DataLocalizationAction.Unknown, data.local_request_trace_id, {
          base_response: { code: StatusCode.InternalError, msg: `${data.action} is unknown action.` }
        });
        return;
      }
      if (!data.value?.type && eventHandler instanceof BaseRequestHandler) {
        withNewSpan('local_data_event', () => {
          eventHandler.execute(portId, data);
        });
      } else if (eventHandler instanceof LiveRequestHandler) {
        const portIDList = this.getAllPortIDList();
        eventHandler.liveExecute(portId, data, portIDList);
      } else {
        this.getPostToRenderFn(portId)(DataLocalizationAction.Unknown, data.local_request_trace_id, {
          base_response: { code: StatusCode.InvalidParam, msg: `Param's type is invalid.` }
        });
      }
    });
    this.portMap.set(portId, port);
  }

  removeSlackPort(alivePorts: number[]) {
    const allPorts = this.getAllPortIDList();
    allPorts.forEach(i => {
      if (!alivePorts.includes(i)) {
        this.closePort(i);
      }
    });
  }

  closePort(portId: number) {
    const port = this.portMap.get(portId);
    if (port) {
      port.removeAllListeners();
      port.close();
      this.portMap.delete(portId);
    }
  }

  end() {
    this.portMap.forEach(port => {
      port.removeAllListeners();
      port.close();
    });
    this.portMap.clear();
  }

  getPostToRenderFn<T>(portId: number) {
    const port = this.portMap.get(portId);
    return function postToRender(action: DataLocalizationAction, local_request_trace_id: string, value: T) {
      if (port === undefined) {
        logError({ portId, action, value, local_request_trace_id }, 'utility process undefined port');
        return;
      }
      port.postMessage({
        action,
        value,
        local_request_trace_id,
        local_request_response_time: Date.now()
      });
    };
  }

  postToAllRender = <T>(action: DataLocalizationAction, local_request_trace_id: string, value: T) => {
    this.portMap.forEach(port => {
      port?.postMessage({
        action,
        value,
        local_request_trace_id,
        local_request_response_time: Date.now()
      });
    });
  };
}
