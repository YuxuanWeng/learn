import { LocalQuoteSearchById } from '@fepkg/services/types/data-localization-manual/quote/search-by-id';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import localRequest from '@/common/request/local-request';

export const fetchLocalQuoteById = (params: LocalQuoteSearchById.Request) => {
  return localRequest.invoke<LocalQuoteSearchById.Request, LocalQuoteSearchById.Response>({
    value: params,
    action: DataLocalizationAction.QuoteSearchById
  });
};
