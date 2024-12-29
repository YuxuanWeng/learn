import type { LocalQuoteSearchOptimalByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-optimal-by-key-market';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalQuoteOptimalByKeyMarket = (params: LocalQuoteSearchOptimalByKeyMarket.Request) => {
  return localRequest.invoke<LocalQuoteSearchOptimalByKeyMarket.Request, LocalQuoteSearchOptimalByKeyMarket.Response>({
    value: params,
    action: DataLocalizationAction.QuoteSearchOptimalByKeyMarket
  });
};
