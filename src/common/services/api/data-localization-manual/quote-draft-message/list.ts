import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalQuoteDraftMessageList = (params: LocalQuoteDraftMessageList.Request) => {
  return localRequest.invoke<LocalQuoteDraftMessageList.Request, LocalQuoteDraftMessageList.Response>({
    value: params,
    action: DataLocalizationAction.QuoteDraftMessageList
  });
};
