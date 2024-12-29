import { DataController } from 'app/packages/data-controller';
import { EventClient } from 'app/packages/event-client';
import { EventClientChannel } from 'app/packages/event-client/types';
import {
  DataLocalizationAction,
  DataUpdateEventMessageResponse,
  DataUpdateEventMessageTypeEnum
} from 'app/types/DataLocalization';
import { isEqual } from 'lodash-es';
import { v4 } from 'uuid';
import { PostToRenderFn } from '../types';
import { DataObserverConfig } from './type';

export const CommonObserverArr = [
  EventClientChannel.InstRealtime,
  EventClientChannel.TraderRealtime,
  EventClientChannel.UserRealtime,
  EventClientChannel.BondDetailRealtime
] as const;

export abstract class BaseObserver<Request, Response> {
  private eventClient: EventClient;

  protected dataController: DataController;

  protected abstract queryFn: (params: Request) => Response;

  protected observerMap: Map<string, [number, Request, Response | undefined] | undefined> = new Map<
    string,
    [number, Request, Response | undefined] | undefined
  >();

  protected getPostToRenderFn: (portId: number) => PostToRenderFn<DataUpdateEventMessageResponse<Response>>;

  constructor(config: DataObserverConfig) {
    this.eventClient = config.eventClient;
    this.getPostToRenderFn = config.getPostToRenderFn;
    this.dataController = config.dataController;
  }

  protected getEventClient() {
    return this.eventClient;
  }

  // 通用函数预备
  protected observerStateChange<Message extends Record<string, unknown>>(config: {
    observerMap: Map<string, [number, Request, Response | undefined] | undefined>;
    channel: EventClientChannel;
    queryFn: (args: Request) => Response;
    type?: DataUpdateEventMessageTypeEnum;
  }) {
    const { channel, observerMap, queryFn, type } = config;
    this.eventClient.on<Message[]>(channel, ctx => {
      if (Array.isArray(ctx) && ctx.length) {
        // 快照数据全查一遍看是否需要更新
        observerMap?.forEach((data, observerId) => {
          const [portId, requestParams, oldValue] = data ?? [];
          // 空参数意味着渲染进程没发起过查询，无需推送更新
          if (!portId || !requestParams || !oldValue) {
            return;
          }

          // 增加回调函数，可以扩展的更灵活
          const newValue = queryFn(requestParams);

          if (!isEqual(newValue, oldValue)) {
            observerMap.set(observerId, [portId, requestParams, newValue]);
            // 通知给渲染进程
            const id = v4();
            this.getPostToRenderFn(portId)(DataLocalizationAction.LiveDataUpdate, id, {
              status: 'success',
              notified_list: [[observerId, newValue]],
              type
            });
          }
        });
      }
    });
  }

  getObserverMap() {
    return this.observerMap;
  }

  getObserverMapById(id: string) {
    return this.observerMap.get(id);
  }

  // 设置该observe所监听的场景中某一具体id的请求参数与数据快照
  setObserverMapById(id: string, value?: [number, Request, Response | undefined]) {
    this.observerMap.set(id, value ?? undefined);
  }

  // 移除该observe所监听的场景中某一具体id的请求参数与数据快照
  removeObserverMap(id: string) {
    this.observerMap.delete(id);
  }

  removeAllObservers() {
    this.observerMap.clear();
  }

  removeSlackObservers(curPortObservers?: [number, string[] | undefined], curPorts?: number[]) {
    this.observerMap.forEach((item, key) => {
      const portId = item?.[0];
      if (portId && curPorts && !curPorts.includes(portId)) {
        this.observerMap.delete(key);
      }
    });

    this.observerMap.forEach((item, key) => {
      const curPortId = item?.[0];
      const [portId, curObservers] = curPortObservers ?? [];
      if (curObservers && !curObservers.includes(key) && portId === curPortId) {
        this.observerMap.delete(key);
      }
    });
  }
}
