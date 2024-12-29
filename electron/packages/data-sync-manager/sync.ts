import { CentrifugeClient, SyncState } from '@fepkg/centrifuge-client';
import { errorToString } from '@fepkg/common/utils';
import { LogLevel } from '@fepkg/logger';
import {
  BondDetailSync,
  DealInfoSync,
  InstSync,
  QuoteDraftDetailSync,
  QuoteDraftMessageSync,
  QuoteSync,
  TraderSync,
  UserSync
} from '@fepkg/services/types/common';
import { SyncDataType } from '@fepkg/services/types/enum';
import { DataLocalizationDashBoardEnum } from 'app/types/DataLocalization';
import { metrics, trackPoint, trackPointWithMetrics } from 'app/utility-process/data-localization/utils';
import { PublicationContext, SubscribedContext } from 'centrifuge';
import { syncDataMapConsumerChannel, syncDataTypeMapRealtimeEventChannel } from '../common/constant';
import { EventClientChannel, EventMessage } from '../event-client/types';
import { DataInitManager } from './init';
import {
  BondDetailRealtimeMessage,
  DataSyncClientConfig,
  DealRealtimeMessage,
  InstRealtimeMessage,
  QuoteDraftMessageRealtimeMessage,
  QuoteDraftRealtimeMessage,
  QuoteRealtimeMessage,
  TraderRealtimeMessage,
  UserRealtimeMessage
} from './types';
import { decodeBase64ProtoData, splitUpdateList } from './utils';

const history_size = 100;
const CHECK_INTERVAL = 10 * 60 * 1000; // 十分钟

export class DataSyncManager extends DataInitManager {
  private centrifugeClient: CentrifugeClient;

  private syncState: SyncState;

  private consumeCache: PublicationContext[];

  private channel: string;

  private checkDataFailedCount: number;

  constructor(config: DataSyncClientConfig) {
    super(config);
    const { centrifugeClient } = config;
    this.centrifugeClient = centrifugeClient;
    this.consumeCache = [];
    this.channel = syncDataMapConsumerChannel.get(this.syncDataType) ?? '';
    this.syncState = {
      status: 'idle',
      offset: undefined,
      epoch: undefined,
      timer: undefined,
      checkTimer: undefined
    };
    this.checkDataFailedCount = 0;
  }

  getSyncState() {
    return {
      status: this.syncState.status,
      offset: this.syncState.offset,
      epoch: this.syncState.epoch
    };
  }

  resetSyncState() {
    this.syncState = {
      status: 'idle',
      offset: undefined,
      epoch: undefined,
      timer: undefined,
      checkTimer: undefined
    };
  }

  isSyncError() {
    return this.syncState.status !== 'success';
  }

  endSync() {
    this.endInit();
    this.centrifugeClient.unsubscribe(this.channel);
    clearInterval(this.syncState.checkTimer);
    this.syncState.checkTimer = undefined;
  }

  private async checkData() {
    // TODO: 目前只接了bond
    // 初始化成功后开始定时监测
    if (this.initState.status !== 'success' || this.syncDataType !== SyncDataType.SyncDataTypeBondDetail) {
      this.checkDataFailedCount = 0;
      return;
    }

    if (this.checkDataFailedCount > 3) {
      trackPointWithMetrics(DataLocalizationDashBoardEnum.CheckSyncDataError, {
        message: '抽样失败',
        syncDataType: this.syncDataType
      });
      this.checkDataFailedCount = 0;
      return;
    }

    try {
      const checkResult = await this.dataReader.checkLocalData(this.syncDataType);
      const { diffCount, localEnableTotal, remoteEnableTotal } = checkResult ?? {};

      if (localEnableTotal !== remoteEnableTotal) {
        trackPointWithMetrics(DataLocalizationDashBoardEnum.CheckSyncDataError, {
          message: '数量错误',
          ...checkResult
        });
      }

      if (diffCount === 0) {
        trackPoint({
          keyword: DataLocalizationDashBoardEnum.CheckSyncDataSuccess,
          ...checkResult
        });
      } else {
        trackPointWithMetrics(DataLocalizationDashBoardEnum.CheckSyncDataError, {
          message: '数据错误',
          ...checkResult
        });
      }
      this.checkDataFailedCount = 0;
    } catch (error) {
      this.checkDataFailedCount++;
      this.checkData();
      trackPointWithMetrics(DataLocalizationDashBoardEnum.CheckSyncDataError, {
        message: '抽样错误',
        error: errorToString(error),
        syncDataType: this.syncDataType
      });
    }
  }

  private updateSyncStateOffset(num?: number) {
    if (num && num > (this.syncState.offset ?? 0)) this.syncState.offset = num;
  }

  private emitSyncEvent(message: EventMessage) {
    if (message?.status === 'error') {
      this.dataWriter.resetSyncVersion(this.syncDataType);
    }
    // 向渲染进程发消息
    this.eventClient.emit(EventClientChannel.DataRealtimeSyncStateChange, {
      syncDataType: this.syncDataType,
      ...message
    });

    // error上报日志大盘
    if (message?.status === 'error') {
      trackPointWithMetrics(DataLocalizationDashBoardEnum.SyncDataError, {
        keyword: DataLocalizationDashBoardEnum.SyncDataError,
        syncDataType: this.syncDataType,
        message: message?.message ?? 'sync unknown error',
        ...(message?.error ? { error: errorToString(message.error) } : undefined)
      });
    }
  }

  /**
   * @override 注意，此处的重载方法要实现初始化的全部功能
   */
  async startInit(needReset: boolean) {
    if (!this.isInitializing()) {
      if (this.channel === '') {
        throw new Error(`Cannot find syncDataType ${this.syncDataType} channel.`);
      }
      // 实时同步逻辑
      this.resetSyncState();
      this.centrifugeClient.unsubscribe(this.channel);
      const subscribedContext = await this.centrifugeClient.subscribe<{ data: string }>(this.channel, {
        onPublish: ctx => {
          // 正常接收消息
          if (this.syncState.status !== 'recover') {
            if (this.consumeCache.length) {
              this.emitSyncEvent({
                status: 'error',
                message: '并发时产生遗漏',
                logContext: { level: LogLevel.ERROR, data: this.getSyncState() }
              });
              const tempConsumeCache: PublicationContext[] = [];
              while (this.consumeCache.length) {
                const item = this.consumeCache.shift();
                if (item) {
                  tempConsumeCache.push(item);
                }
              }
              for (const p of tempConsumeCache) {
                this.updateData(p.data.data);
              }
            }

            this.updateData(ctx.data.data);
            this.updateSyncStateOffset(ctx.offset);
          } else {
            this.consumeCache.push(ctx);
          }
        },
        onTempConnectionLoss: ctx => {
          metrics.counter(
            DataLocalizationDashBoardEnum.WsTempConnectionLoss,
            1,
            { syncDataType: this.syncDataType },
            true
          );

          // 断网期间默认数据为warning状态, 此时用户行为也无法响应, 并存在恢复数据的可能, 不属于error态, 待网络恢复时再判断数据是否可信
          this.syncState.status = 'warning';
          this.emitSyncEvent({
            status: 'warning',
            message: '网络异常，实时同步失去连接',
            error: ctx?.reason,
            logContext: { level: LogLevel.WARN, data: { ...ctx, ...this.getSyncState() } }
          });
        },
        onResubscribe: ctx => {
          metrics.counter(DataLocalizationDashBoardEnum.WsResubscribe, 1, { syncDataType: this.syncDataType }, true);

          // 丢包、重连时的兜底逻辑
          if (this.syncState.offset !== ctx.streamPosition?.offset) {
            this.recoverData(ctx);
          } else {
            // TODO 通知实时同步已恢复
            this.syncState.status = 'success';
            this.emitSyncEvent({
              status: 'success',
              message: '实时同步恢复',
              logContext: { level: LogLevel.INFO, data: { message: '实时同步恢复', ...this.getSyncState() } }
            });
          }
        },
        onError: ctx => {
          metrics.counter(DataLocalizationDashBoardEnum.SyncDisconnect, 1, { syncDataType: this.syncDataType }, true);
          //  未知异常报错
          this.syncState.status = 'error';
          this.emitSyncEvent({
            status: 'error',
            message: 'ws未知异常报错',
            error: ctx?.error,
            logContext: { level: LogLevel.ERROR, data: { ...ctx, ...this.getSyncState() } }
          });
        }
      });
      trackPoint({
        keyword: DataLocalizationDashBoardEnum.StartWsConnect,
        syncDataType: this.syncDataType
      });

      // 初始化逻辑
      this.resetInitState();
      // console.log('startFetchData', needReset);
      this.startFetchData(needReset);

      this.updateSyncStateOffset(subscribedContext.streamPosition?.offset ?? 0);
      this.syncState.epoch = subscribedContext.streamPosition?.epoch ?? '';
      this.syncState.status = 'success';
      this.syncState.checkTimer = setInterval(this.checkData.bind(this), CHECK_INTERVAL);
    }
  }

  private updateData(data: string) {
    try {
      const result = decodeBase64ProtoData(data);
      let realtimeChangeList;
      switch (this.syncDataType) {
        case SyncDataType.SyncDataTypeQuote:
          if (result?.quote_list?.length) {
            const { enableList, disableList } = splitUpdateList<QuoteSync>(result.quote_list);
            this.dataWriter.upsertQuoteList(enableList);
            const deleteList = this.dataWriter.deleteQuoteList(disableList);

            const changeList: QuoteRealtimeMessage[] = enableList
              .map(quote => ({
                quote_id: quote.quote_id,
                bond_key_market: quote.bond_key_market ?? ''
              }))
              .concat(...deleteList);
            realtimeChangeList = changeList;
          }
          break;
        case SyncDataType.SyncDataTypeDeal:
          if (result?.deal_info_list?.length) {
            const { enableList, disableList } = splitUpdateList<DealInfoSync>(result.deal_info_list);
            this.dataWriter.upsertDealInfoList(enableList);
            const deleteList = this.dataWriter.deleteDealInfoList(disableList);

            const changeList: DealRealtimeMessage[] = enableList
              .map(deal => ({
                deal_id: deal.deal_id
              }))
              .concat(...deleteList);
            realtimeChangeList = changeList;
          }
          break;
        case SyncDataType.SyncDataTypeTrader:
          if (result?.trader_list?.length) {
            const { enableList, disableList } = splitUpdateList<TraderSync>(result.trader_list);
            this.dataWriter.upsertTraderList(enableList);
            const deleteList = this.dataWriter.deleteTraderList(disableList);

            const changeList: TraderRealtimeMessage[] = enableList
              .map(trader => ({
                trader_id: trader.trader_id
              }))
              .concat(...deleteList);
            realtimeChangeList = changeList;
          }
          break;
        case SyncDataType.SyncDataTypeInst:
          if (result?.inst_list?.length) {
            const { enableList, disableList } = splitUpdateList<InstSync>(result.inst_list);
            this.dataWriter.upsertInstList(enableList);
            const deleteList = this.dataWriter.deleteInstList(disableList);

            const changeList: InstRealtimeMessage[] = enableList
              .map(inst => ({
                inst_id: inst.inst_id
              }))
              .concat(...deleteList);
            realtimeChangeList = changeList;
          }
          break;
        case SyncDataType.SyncDataTypeUser:
          if (result?.user_list?.length) {
            const { enableList, disableList } = splitUpdateList<UserSync>(result.user_list);
            this.dataWriter.upsertUserList(enableList);
            const deleteList = this.dataWriter.deleteUserList(disableList);

            const changeList: UserRealtimeMessage[] = enableList
              .map(user => ({
                user_id: user.user_id
              }))
              .concat(...deleteList);
            realtimeChangeList = changeList;
          }
          break;
        case SyncDataType.SyncDataTypeQuoteDraft:
          if (result?.quote_draft_detail_list?.length) {
            const { enableList, disableList } = splitUpdateList<QuoteDraftDetailSync>(result.quote_draft_detail_list);
            this.dataWriter.upsertQuoteDraftDetailList(enableList);
            const deleteList = this.dataWriter.deleteQuoteDraftDetailList(disableList);

            const changeList: QuoteDraftRealtimeMessage[] = enableList
              .map(detail => ({
                detail_id: detail.detail_id,
                message_id: detail.message_id ?? ''
              }))
              .concat(...deleteList);

            realtimeChangeList = changeList;
          }
          break;
        case SyncDataType.SyncDataTypeQuoteDraftMessage:
          if (result?.quote_draft_message_list?.length) {
            const { enableList, disableList } = splitUpdateList<QuoteDraftMessageSync>(result.quote_draft_message_list);
            this.dataWriter.upsertQuoteDraftMessageList(enableList);
            const deleteList = this.dataWriter.deleteQuoteDraftMessageList(disableList);

            const changeList: QuoteDraftMessageRealtimeMessage[] = enableList
              .map(detail => ({
                message_id: detail.message_id
              }))
              .concat(...deleteList);

            realtimeChangeList = changeList;
          }
          break;
        case SyncDataType.SyncDataTypeBondDetail:
          if (result?.bond_detail_list?.length) {
            const { enableList, disableList } = splitUpdateList<BondDetailSync>(result.bond_detail_list);
            this.dataWriter.upsertBondDetailList(enableList);
            const deleteList = this.dataWriter.deleteBondDetailList(disableList);

            const changeList: BondDetailRealtimeMessage[] = enableList
              .map(detail => ({
                ficc_id: detail.ficc_id,
                key_market: detail.key_market ?? ''
              }))
              .concat(...deleteList);

            realtimeChangeList = changeList;
          }
          break;
        default:
          break;
      }
      // 广播变更
      const channel = syncDataTypeMapRealtimeEventChannel.get(this.syncDataType);
      if (channel && realtimeChangeList) {
        this.eventClient.emit(channel, realtimeChangeList);
      }
    } catch (error) {
      this.syncState.status = 'error';
      this.emitSyncEvent({
        status: 'error',
        message: '数据更新入库失败',
        error,
        logContext: { level: LogLevel.ERROR, data: this.getSyncState() }
      });
    }
  }

  private async recoverData(ctx: SubscribedContext) {
    try {
      this.syncState.status = 'recover';
      if (!ctx.streamPosition || !this.syncState.offset) {
        throw new Error('实时更新无法恢复');
      }
      const count = ctx.streamPosition.offset - this.syncState.offset;
      if (count > history_size) {
        throw new Error('Recover publications out of history_size.');
      }
      const history = await this.centrifugeClient.getHistory(this.channel, {
        limit: count,
        since: { offset: this.syncState.offset ?? 0, epoch: this.syncState.epoch ?? '' }
      });

      if (count !== history.publications.length) {
        throw new Error('Some publications stale dated.');
      }

      const tempConsumeCache: PublicationContext[] = [];
      while (this.consumeCache.length) {
        const item = this.consumeCache.shift();
        if (item) {
          tempConsumeCache.push(item);
        }
      }
      // concat 重连瞬间接受到的数据
      const publications = history?.publications.concat(...tempConsumeCache) ?? [];

      for (const p of publications) {
        this.updateData(p.data.data as string);
      }
      // 更新offset
      this.updateSyncStateOffset(Math.max(...publications.map(p => p.offset ?? 0)));
      this.syncState.status = 'success';
      this.emitSyncEvent({
        status: 'success',
        message: '实时同步恢复',
        logContext: { level: LogLevel.INFO, data: { message: '实时同步恢复', ...this.getSyncState() } }
      });
    } catch (error) {
      this.syncState.status = 'error';
      this.emitSyncEvent({
        status: 'error',
        message: '实时更新恢复失败',
        error,
        logContext: { level: LogLevel.ERROR, data: this.getSyncState() }
      });
    }
  }
}
