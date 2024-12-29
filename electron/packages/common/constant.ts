import { SyncDataType } from '@fepkg/services/types/enum';
import { EventClientChannel } from '../event-client/types';

export const syncDataTypeMapInitEventChannel = new Map<SyncDataType, EventClientChannel>([
  [SyncDataType.SyncDataTypeNone, EventClientChannel.NoneInit],
  [SyncDataType.SyncDataTypeQuote, EventClientChannel.QuoteInit],
  [SyncDataType.SyncDataTypeDeal, EventClientChannel.DealInit],
  [SyncDataType.SyncDataTypeTrader, EventClientChannel.TraderInit],
  [SyncDataType.SyncDataTypeInst, EventClientChannel.InstInit],
  [SyncDataType.SyncDataTypeUser, EventClientChannel.UserInit],
  [SyncDataType.SyncDataTypeQuoteDraft, EventClientChannel.QuoteDraftInit],
  [SyncDataType.SyncDataTypeHoliday, EventClientChannel.HolidayInit],
  [SyncDataType.SyncDataTypeQuoteDraftMessage, EventClientChannel.QuoteDraftMessageInit],
  [SyncDataType.SyncDataTypeBondDetail, EventClientChannel.BondDetailInit]
]);

export const syncDataTypeMapRealtimeEventChannel = new Map<SyncDataType, EventClientChannel>([
  [SyncDataType.SyncDataTypeNone, EventClientChannel.NoneRealtime],
  [SyncDataType.SyncDataTypeQuote, EventClientChannel.QuoteRealtime],
  [SyncDataType.SyncDataTypeDeal, EventClientChannel.DealRealtime],
  [SyncDataType.SyncDataTypeTrader, EventClientChannel.TraderRealtime],
  [SyncDataType.SyncDataTypeInst, EventClientChannel.InstRealtime],
  [SyncDataType.SyncDataTypeUser, EventClientChannel.UserRealtime],
  [SyncDataType.SyncDataTypeQuoteDraft, EventClientChannel.QuoteDraftRealtime],
  [SyncDataType.SyncDataTypeQuoteDraftMessage, EventClientChannel.QuoteDraftMessageRealtime],
  [SyncDataType.SyncDataTypeBondDetail, EventClientChannel.BondDetailRealtime]
]);

export const syncDataMapConsumerChannel = new Map<SyncDataType, string>([
  [SyncDataType.SyncDataTypeQuote, 'data_sync_consumer_quote'],
  [SyncDataType.SyncDataTypeDeal, 'data_sync_consumer_deal'],
  [SyncDataType.SyncDataTypeTrader, 'data_sync_consumer_trader'],
  [SyncDataType.SyncDataTypeInst, 'data_sync_consumer_inst'],
  [SyncDataType.SyncDataTypeUser, 'data_sync_consumer_user'],
  [SyncDataType.SyncDataTypeQuoteDraftMessage, 'data_sync_consumer_quote_draft_message'],
  [SyncDataType.SyncDataTypeQuoteDraft, 'data_sync_consumer_quote_draft_detail'],
  [SyncDataType.SyncDataTypeBondDetail, 'data_sync_consumer_bond_detail']
]);
