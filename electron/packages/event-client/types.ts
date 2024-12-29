import { Status } from '@fepkg/centrifuge-client';
import { LogContext } from '@fepkg/logger';
import { SyncDataType } from '@fepkg/services/types/enum';

export enum EventClientChannel {
  DataRealtimeSyncStateChange = 'event-client-data-realtime-sync-state-change',
  DataInitSyncStateChange = 'event-client-data-init-sync-state-change',

  NoneInit = 'none-init',
  QuoteInit = 'quote-init',
  DealInit = 'deal-init',
  TraderInit = 'trader-init',
  InstInit = 'inst-init',
  UserInit = 'broker-init',
  QuoteDraftInit = 'quoteDraft-init',
  HolidayInit = 'holiday-init',
  QuoteDraftMessageInit = 'quoteDraftMessage-init',
  BondDetailInit = 'bondDetail-init',

  NoneRealtime = 'none-realtime',
  QuoteRealtime = 'quote-realtime',
  DealRealtime = 'deal-realtime',
  TraderRealtime = 'trader-realtime',
  InstRealtime = 'inst-realtime',
  UserRealtime = 'user-realtime',
  QuoteDraftRealtime = 'quoteDraft-realtime',
  QuoteDraftMessageRealtime = 'quoteDraftMessage-realtime',
  QuoteDraftMessageTotalRealtime = 'quoteDraftMessage-total-realtime',
  BondDetailRealtime = 'bondDetail-realtime'
}

export type EventMessage = {
  /** 状态 */
  status: Status;
  /** 信息 */
  message?: string;
  /** 数据类型 */
  syncDataType?: SyncDataType;
  /** 日志信息 */
  logContext?: LogContext;
  /** 错误具体信息 */
  error?: unknown;
};

export type DataRealtimeSyncEventMessage = EventMessage;

export type DataInitSyncEventMessage = EventMessage & {
  /** 初始化同步进度 */
  progress?: number;
};

export type DataCheckSyncEventMessage = EventMessage & {
  channel: 'ws' | 'http';
};
