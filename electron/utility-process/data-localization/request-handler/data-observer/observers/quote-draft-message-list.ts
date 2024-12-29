import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { QuoteDraftMessageRealtimeMessage, QuoteDraftRealtimeMessage } from 'app/packages/data-sync-manager/types';
import { EventClientChannel } from 'app/packages/event-client/types';
import {
  DataLocalizationAction,
  DataUpdateEventMessageTypeEnum,
  NotifiedObserverIdList
} from 'app/types/DataLocalization';
import { QuoteDraftDetail } from 'app/types/DataLocalization/local-common';
import { debounce } from 'lodash-es';
import { v4 } from 'uuid';
import { BaseObserver } from '../base';
import { DataObserverConfig } from '../type';
import { getQuoteDraftMessageDiff } from './utils';

type INotifiedQuoteDraftMessage = {
  portId?: number;
  notifiedQuoteDraftMessage?: NotifiedObserverIdList<LocalQuoteDraftMessageList.Response>;
  newValue?: LocalQuoteDraftMessageList.Response;
};

export class QuoteDraftMessageListObserver extends BaseObserver<
  LocalQuoteDraftMessageList.Request,
  LocalQuoteDraftMessageList.Response
> {
  protected queryFn = this.dataController.quoteDraftMessageList.bind(this.dataController);

  private getDetailList: (idList: string[]) => QuoteDraftDetail[];

  private cacheMap: Map<
    EventClientChannel,
    QuoteDraftMessageRealtimeMessage[] | QuoteDraftRealtimeMessage[] | undefined
  > = new Map<EventClientChannel, QuoteDraftMessageRealtimeMessage[] | QuoteDraftRealtimeMessage[] | undefined>();

  private debounceWait = 15;

  private handleMessageRealTimeDebounce: () => void;

  private handleDetailRealTimeDebounce: () => void;

  constructor(config: DataObserverConfig) {
    super(config);
    this.getDetailList = config.dataController.detailList.bind(config.dataController);

    this.observerQuoteSyncStateChange();

    this.handleMessageRealTimeDebounce = debounce(this.handleMessageRealTime, this.debounceWait);
    this.handleDetailRealTimeDebounce = debounce(this.handleDetailRealTime, this.debounceWait);
  }

  private observerQuoteSyncStateChange() {
    const eventClient = this.getEventClient();
    const messageChannel = EventClientChannel.QuoteDraftMessageRealtime;
    const detailChannel = EventClientChannel.QuoteDraftRealtime;

    // 当message发生变更
    eventClient.on<QuoteDraftMessageRealtimeMessage[]>(messageChannel, ctx => {
      const cache = this.cacheMap.get(messageChannel) as QuoteDraftMessageRealtimeMessage[] | undefined;
      const ctxList = cache ? cache.concat(ctx) : ctx;
      this.cacheMap.set(messageChannel, ctxList);

      this.handleMessageRealTimeDebounce();
    });

    // 当detail发生变更时
    eventClient.on<QuoteDraftRealtimeMessage[]>(detailChannel, ctx => {
      const cache = this.cacheMap.get(detailChannel) as QuoteDraftRealtimeMessage[] | undefined;
      const ctxList = cache ? cache.concat(ctx) : ctx;
      this.cacheMap.set(detailChannel, ctxList);

      this.handleDetailRealTimeDebounce();
    });
  }

  private getNotifiedQuoteDraftMessage(
    observerId: string,
    data?: [number, LocalQuoteDraftMessageList.Request, LocalQuoteDraftMessageList.Response | undefined]
  ): INotifiedQuoteDraftMessage {
    const [portId, requestParams, oldValue] = data ?? [];

    // 空参数意味着渲染进程没发起过查询，无需推送更新
    if (!portId || !requestParams || !oldValue) {
      return {};
    }

    // observer_disabled为true时不推送
    if (requestParams.observer_disabled) {
      return {};
    }

    const newValue = this.queryFn(requestParams);

    const { upsert_message_list, delete_message_id_list, has_diff } =
      getQuoteDraftMessageDiff(oldValue ?? {}, newValue ?? {}) ?? {};

    if (has_diff) {
      this.setObserverMapById(observerId, [portId, requestParams, newValue]);
      return {
        portId,
        notifiedQuoteDraftMessage: [
          observerId,
          {
            ...(upsert_message_list.length ? { upsert_message_list } : {}),
            ...(delete_message_id_list.length ? { delete_message_id_list } : {}),
            hasMore: newValue.hasMore,
            total: newValue.total,
            latestCreateTime: newValue.latestCreateTime
          }
        ],
        newValue
      };
    }
    return {};
  }

  private handleMessageRealTime() {
    const channel = EventClientChannel.QuoteDraftMessageRealtime;
    const ctx = this.cacheMap.get(channel);
    this.cacheMap.delete(channel);

    const messageIdList = (ctx ?? []).map(item => item.message_id);

    const observerMap = this.getObserverMap();
    // console.log(ctx, 'EventClientChannel.QuoteDraftMessageRealtime start');

    if (messageIdList.length) {
      observerMap?.forEach((data, observerId) => {
        const { portId, notifiedQuoteDraftMessage } = this.getNotifiedQuoteDraftMessage(observerId, data);
        if (portId && notifiedQuoteDraftMessage) {
          // 通知给渲染进程;
          this.getPostToRenderFn(portId)(DataLocalizationAction.LiveDataUpdate, v4(), {
            status: 'success',
            type: DataUpdateEventMessageTypeEnum.QuoteDraftMessageIncrement,
            notified_list: [notifiedQuoteDraftMessage]
          });
        }
      });
    }
  }

  private handleDetailRealTime() {
    const channel = EventClientChannel.QuoteDraftRealtime;
    const ctx = this.cacheMap.get(channel) as QuoteDraftRealtimeMessage[] | undefined;
    this.cacheMap.delete(channel);

    const messageIdList = (ctx ?? []).map(item => item.message_id);

    const observerMap = this.getObserverMap();

    if (messageIdList.length) {
      observerMap?.forEach((data, observerId) => {
        const [portId, requestParams, oldValue] = data ?? [];

        // 空参数意味着渲染进程没发起过查询，无需推送更新
        if (!portId || !requestParams || !oldValue) {
          return;
        }
        // observer_disabled为true时不推送
        if (requestParams.observer_disabled) {
          return;
        }

        const notifiedQuoteDraftDetailList: NotifiedObserverIdList<LocalQuoteDraftMessageList.Response>[] = [];

        const detailIdList = (ctx ?? []).map(item => item.detail_id);

        const detailList = this.getDetailList(detailIdList);

        // 如果detail的状态为非前端状态，要重新查一遍message，undefined也查
        const { notifiedQuoteDraftMessage, newValue } = this.getNotifiedQuoteDraftMessage(observerId, data);
        if (notifiedQuoteDraftMessage) {
          this.getPostToRenderFn(portId)(DataLocalizationAction.LiveDataUpdate, v4(), {
            status: 'success',
            type: DataUpdateEventMessageTypeEnum.QuoteDraftMessageIncrement,
            notified_list: [notifiedQuoteDraftMessage]
          });
        }

        // 优先用newValue，空则说明newValue与oldValue一致
        const curMessageIdList = (newValue ?? oldValue)?.quote_draft_message_list?.map(m => m.message_id);
        const involvedMessageIdList = messageIdList.filter(m => curMessageIdList?.includes(m));

        // detail与该页message无关
        if (!involvedMessageIdList?.length) {
          return;
        }

        const upsert_detail_list = detailList.filter(
          item => item.message_id && involvedMessageIdList.includes(item.message_id)
        );

        // 有diff才有newValue
        const { total, hasMore, latestCreateTime } = newValue ?? oldValue;

        if (upsert_detail_list.length) {
          notifiedQuoteDraftDetailList.push([observerId, { upsert_detail_list, total, hasMore, latestCreateTime }]);
        }
        // 通知给渲染进程;
        if (notifiedQuoteDraftDetailList.length) {
          this.getPostToRenderFn(portId)(DataLocalizationAction.LiveDataUpdate, v4(), {
            status: 'success',
            type: DataUpdateEventMessageTypeEnum.QuoteDraftMessageIncrement,
            notified_list: notifiedQuoteDraftDetailList
          });
        }
      });
    }
  }
}
