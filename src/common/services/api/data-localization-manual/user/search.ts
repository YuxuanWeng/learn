import type { LocalUserSearch } from '@fepkg/services/types/data-localization-manual/user/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalUser = (params: LocalUserSearch.Request) => {
  return localRequest.invoke<LocalUserSearch.Request, LocalUserSearch.Response>({
    value: params,
    action: DataLocalizationAction.UserSearch
  });
};
