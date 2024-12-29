import type { LocalTraderSearch } from '@fepkg/services/types/data-localization-manual/trader/search';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalTrader = (params: LocalTraderSearch.Request) => {
  return localRequest.invoke<LocalTraderSearch.Request, LocalTraderSearch.Response>({
    value: params,
    action: DataLocalizationAction.TraderSearch
  });
};
