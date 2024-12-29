import { DealQuote } from '@fepkg/services/types/bds-common';
import { LocalServerQuoteGetById } from '@fepkg/services/types/local-server/quote-get-by-id';
import { LiveQueryConfig, LocalServerApi } from '../types';
import { useLocalServerLiveQuery } from '../useLocalServerLiveQuery';
import { LocalServerApiMapScene } from '../utils';

const api = LocalServerApi.QuoteById;
export const useQuoteByIdQuery = ({
  params,
  interval,
  enabled = true
}: LiveQueryConfig<LocalServerQuoteGetById.Request>) => {
  const enable = enabled && !!params?.quote_id;

  return useLocalServerLiveQuery<
    LocalServerQuoteGetById.Request,
    LocalServerQuoteGetById.Response,
    DealQuote | undefined
  >({
    api,
    scene: LocalServerApiMapScene[api],
    params,
    interval,
    select: data => data?.quote,
    enabled: enable
  });
};
