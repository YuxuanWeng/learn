import type { LocalBondSearch } from '@fepkg/services/types/data-localization-manual/bond/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalBond = (params: LocalBondSearch.Request) => {
  return localRequest.invoke<LocalBondSearch.Request, LocalBondSearch.Response>({
    value: params,
    action: DataLocalizationAction.BondSearch
  });
};
