import { StatusCode } from '@fepkg/request/types';
import { LocalQuoteSearchById } from '@fepkg/services/types/data-localization-manual/quote/search-by-id';
import type { LocalQuoteSearchByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-by-key-market';
import type { LocalQuoteSearchOptimalByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-optimal-by-key-market';
import { captureMessage } from '@sentry/react';
import { fetchLocalQuoteById } from '@/common/services/api/data-localization-manual/quote/search-by-id';
import { fetchLocalQuoteByKeyMarket } from '@/common/services/api/data-localization-manual/quote/search-by-key-market';
import { fetchLocalQuoteOptimalByKeyMarket } from '@/common/services/api/data-localization-manual/quote/search-optimal-by-key-market';
import { SpotDate } from '@/components/IDCSpot/types';

export const fetchQuoteList = async (
  observer_id: string,
  key_market?: string,
  broker_id?: string,
  spot_date?: SpotDate
): Promise<LocalQuoteSearchByKeyMarket.Response | undefined> => {
  try {
    if (!key_market) {
      return await Promise.reject(new Error('KeyMarket is undefined.'));
    }

    if (key_market && !broker_id) {
      return undefined;
    }

    const value = await fetchLocalQuoteByKeyMarket({
      key_market,
      broker_id,
      spot_date,
      observer_id,
      type: 'create'
    });

    const { base_response } = value ?? {};

    if (base_response?.code !== StatusCode.Success) {
      captureMessage('fetchQuoteList', { extra: value });
      return await Promise.reject(new Error(base_response?.msg ?? ''));
    }
    return value;
  } catch (err) {
    return await Promise.reject(err);
  }
};

export const fetchQuoteOptimalListMap = async (
  observer_id: string,
  key_market?: string,
  spot_date?: SpotDate,
  ignore_retail?: boolean
): Promise<LocalQuoteSearchOptimalByKeyMarket.Response | undefined> => {
  try {
    if (!key_market) {
      return await Promise.reject(new Error('KeyMarket is undefined.'));
    }
    const value = await fetchLocalQuoteOptimalByKeyMarket({
      key_market,
      observer_id,
      spot_date,
      ignore_retail,
      type: 'create'
    });
    const { base_response } = value ?? {};

    if (base_response?.code !== StatusCode.Success) {
      captureMessage('fetchQuoteList', { extra: value });
      return await Promise.reject(new Error(base_response?.msg ?? ''));
    }
    return value;
  } catch (err) {
    return await Promise.reject(err);
  }
};

export const fetchSingleQuote = async (
  observer_id: string,
  quote_id?: string
): Promise<LocalQuoteSearchById.Response | undefined> => {
  try {
    if (!quote_id) {
      return await Promise.reject(new Error('quoteId is undefined.'));
    }
    const value = await fetchLocalQuoteById({
      observer_id,
      quote_id,
      type: 'create'
    });
    const { base_response } = value ?? {};

    if (base_response?.code !== StatusCode.Success) {
      captureMessage('fetchSingleQuote', { extra: value });
      return await Promise.reject(new Error(base_response?.msg ?? ''));
    }
    return value;
  } catch (err) {
    return await Promise.reject(err);
  }
};
