import { SyncDataType } from '@fepkg/services/types/enum';

export enum SortField {
  SortYield = 'yield',
  SortClearPrice = 'clearPrice',
  SortFullPrice = 'fullPrice',
  SortReturnPoint = 'returnPoint',
  SortCreateTime = 'createTime',
  SortUpdateTime = 'updateTime'
}

export enum SortType {
  SortTypeAsc = 'asc',
  SortTypeDesc = 'desc'
}

export enum ServiceType {
  QuoteService = 'quoteService',
  TraderService = 'traderService',
  UserService = 'userService',
  InstService = 'instService',
  BondService = 'bondService',
  HolidayService = 'holidayService',
  QuoteDraftService = 'quoteDraftService',
  DealService = 'dealService'
}

export const Service2SyncDataTypeMap: Record<string, SyncDataType[]> = {
  [ServiceType.QuoteService]: [SyncDataType.SyncDataTypeQuote],
  [ServiceType.TraderService]: [SyncDataType.SyncDataTypeTrader],
  [ServiceType.UserService]: [SyncDataType.SyncDataTypeUser],
  [ServiceType.InstService]: [SyncDataType.SyncDataTypeInst],
  [ServiceType.BondService]: [SyncDataType.SyncDataTypeBondDetail],
  [ServiceType.HolidayService]: [SyncDataType.SyncDataTypeHoliday],
  [ServiceType.QuoteDraftService]: [SyncDataType.SyncDataTypeQuoteDraft, SyncDataType.SyncDataTypeQuoteDraftMessage],
  [ServiceType.DealService]: [SyncDataType.SyncDataTypeDeal]
};

export const SyncDataType2ServiceMap = new Map<SyncDataType, ServiceType>([
  [SyncDataType.SyncDataTypeQuote, ServiceType.QuoteService],
  [SyncDataType.SyncDataTypeTrader, ServiceType.TraderService],
  [SyncDataType.SyncDataTypeUser, ServiceType.UserService],
  [SyncDataType.SyncDataTypeInst, ServiceType.InstService],
  [SyncDataType.SyncDataTypeBondDetail, ServiceType.BondService],
  [SyncDataType.SyncDataTypeHoliday, ServiceType.HolidayService],
  [SyncDataType.SyncDataTypeQuoteDraft, ServiceType.QuoteDraftService],
  [SyncDataType.SyncDataTypeQuoteDraftMessage, ServiceType.QuoteDraftService],
  [SyncDataType.SyncDataTypeDeal, ServiceType.DealService]
]);
