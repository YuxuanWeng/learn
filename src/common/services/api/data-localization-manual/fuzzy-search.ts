import type { LocalFuzzySearch } from '@fepkg/services/types/data-localization-manual/fuzzy-search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalFuzzySearch = (params: LocalFuzzySearch.Request) => {
  return localRequest.invoke<LocalFuzzySearch.Request, LocalFuzzySearch.Response>({
    value: params,
    action: DataLocalizationAction.FuzzySearch
  });
};
