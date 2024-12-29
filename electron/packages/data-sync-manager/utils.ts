import { protoRoot } from '@fepkg/request/protobuf';
import type { BaseDataBaseSyncDataScan } from '@fepkg/services/types/base-data/base-sync-data-scan';
import type { BaseDataSyncDataScan } from '@fepkg/services/types/base-data/sync-data-scan';
import { DataFeed } from '@fepkg/services/types/common';
import { Enable, SyncDataType } from '@fepkg/services/types/enum';
import { Type } from 'protobufjs';

const responseType = protoRoot.lookupType('DataFeedStruct');

const getResponseTransformer =
  (protobufType: Type) =>
  <T>(response: string): T | undefined => {
    const buffer = Buffer.from(response, 'base64');
    return protobufType.decode(buffer) as unknown as T;
  };

export const decodeBase64ProtoData = getResponseTransformer(responseType)<DataFeed>;

export const splitUpdateList = <T extends { enable?: Enable }>(list?: T[]) => {
  const enableList: T[] = [];
  const disableList: T[] = [];

  list?.forEach(value => {
    if (value.enable === Enable.DataEnable) {
      enableList.push(value);
    } else {
      disableList.push(value);
    }
  });

  return { enableList, disableList };
};

const getEnableCount = <T extends { enable?: Enable }>(dataList?: T[]) => {
  let enableNum = 0;
  let disableNum = 0;
  const total = dataList?.length || 0;

  for (let i = 0; i < total; i++) {
    if (dataList?.[i].enable === Enable.DataEnable) {
      enableNum++;
    } else if (dataList?.[i].enable === Enable.DataDisable) {
      disableNum++;
    }
  }

  return {
    total,
    enableNum,
    disableNum
  };
};
export const transformInit2LogData = (
  response: BaseDataBaseSyncDataScan.Response & BaseDataSyncDataScan.Response,
  syncDataType: SyncDataType
) => {
  const syncDataTypeListMap = new Map<SyncDataType, { enable?: Enable }[] | undefined>([
    [SyncDataType.SyncDataTypeQuote, response?.quote_list],
    [SyncDataType.SyncDataTypeDeal, response?.deal_info_list],
    [SyncDataType.SyncDataTypeTrader, response?.trader_list],
    [SyncDataType.SyncDataTypeInst, response?.inst_list],
    [SyncDataType.SyncDataTypeUser, response?.user_list],
    [SyncDataType.SyncDataTypeQuoteDraft, response?.quote_draft_detail_list],
    [SyncDataType.SyncDataTypeQuoteDraftMessage, response?.quote_draft_message_list],
    [SyncDataType.SyncDataTypeHoliday, response?.holiday_list],
    [SyncDataType.SyncDataTypeBondDetail, response?.bond_detail_list]
  ]);
  const list = getEnableCount(syncDataTypeListMap.get(syncDataType));

  return {
    response: {
      base_response: response.base_response,
      search_after: response.search_after,
      list
    }
  };
};
