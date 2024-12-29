import type { LocalQuoteSearchByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-by-key-market';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalQuoteByKeyMarket = (params: LocalQuoteSearchByKeyMarket.Request) => {
  return localRequest.invoke<LocalQuoteSearchByKeyMarket.Request, LocalQuoteSearchByKeyMarket.Response>({
    value: params,
    action: DataLocalizationAction.QuoteSearchByKeyMarket
  });
};
