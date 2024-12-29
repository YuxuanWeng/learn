import { LocalServerOptimalQuoteGetByKeyMarket } from '@fepkg/services/types/local-server/optimal-quote-get-by-key-market';
import { QuoteOptimalListMap } from '@/common/services/hooks/useLiveQuery/BondQuote';
import { LiveQueryConfig, LocalServerApi } from '../types';
import { useLocalServerLiveQuery } from '../useLocalServerLiveQuery';
import { LocalServerApiMapScene } from '../utils';

const api = LocalServerApi.OptimalQuoteByKeyMarket;

export const useOptimalQuoteByKeyMarketQuery = ({
  params,
  interval,
  enabled = true
}: LiveQueryConfig<LocalServerOptimalQuoteGetByKeyMarket.Request>) => {
  const enable = enabled && !!params?.key_market;

  return useLocalServerLiveQuery<
    LocalServerOptimalQuoteGetByKeyMarket.Request,
    LocalServerOptimalQuoteGetByKeyMarket.Response,
    QuoteOptimalListMap
  >({
    api,
    scene: LocalServerApiMapScene[api],
    params,
    interval,
    select: data => {
      return {
        bidOptimalQuoteList: data?.bid_optimal_list ?? [],
        bidSubOptimalQuoteList: data?.bid_sub_optimal_list ?? [],
        ofrOptimalQuoteList: data?.ofr_optimal_list ?? [],
        ofrSubOptimalQuoteList: data?.ofr_sub_optimal_list ?? []
      };
    },
    enabled: enable
  });
};
