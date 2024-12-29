import { DealQuote } from '@fepkg/services/types/bds-common';
import { LocalServerQuoteGetByKeyMarket } from '@fepkg/services/types/local-server/quote-get-by-key-market';
import { LiveQueryConfig, LocalServerApi } from '../types';
import { useLocalServerLiveQuery } from '../useLocalServerLiveQuery';
import { LocalServerApiMapScene } from '../utils';

const api = LocalServerApi.QuoteByKeyMarket;

export const useQuoteByKeyMarketQuery = ({
  params,
  interval,
  enabled = true
}: LiveQueryConfig<LocalServerQuoteGetByKeyMarket.Request>) => {
  const enable = enabled && !!params?.key_market && !!params?.broker_id;

  return useLocalServerLiveQuery<
    LocalServerQuoteGetByKeyMarket.Request,
    LocalServerQuoteGetByKeyMarket.Response,
    DealQuote[]
  >({
    api,
    scene: LocalServerApiMapScene[api],
    params,
    interval,
    select: data => {
      return data?.quote_list ?? [];
    },
    enabled: enable
  });
};
