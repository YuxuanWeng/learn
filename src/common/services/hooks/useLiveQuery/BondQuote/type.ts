import { DealQuote } from '@fepkg/services/types/common';

export type QuoteOptimalListMap = {
  bidOptimalQuoteList: DealQuote[];
  bidSubOptimalQuoteList: DealQuote[];
  ofrOptimalQuoteList: DealQuote[];
  ofrSubOptimalQuoteList: DealQuote[];
};
