import type { LocalDealRecordList } from '@fepkg/services/types/data-localization-manual/deal-info/record-list';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalDealRecordList = (params: LocalDealRecordList.Request) => {
  return localRequest.invoke<LocalDealRecordList.Request, LocalDealRecordList.Response>({
    value: params,
    action: DataLocalizationAction.DealRecordList
  });
};
