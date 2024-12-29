import type { LocalInstSearch } from '@fepkg/services/types/data-localization-manual/inst/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalInst = (params: LocalInstSearch.Request) => {
  return localRequest.invoke<LocalInstSearch.Request, LocalInstSearch.Response>({
    value: params,
    action: DataLocalizationAction.InstSearch
  });
};
