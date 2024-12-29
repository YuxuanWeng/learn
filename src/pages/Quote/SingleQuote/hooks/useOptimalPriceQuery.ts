import { createQuery } from 'react-query-kit';
import { APIs } from '@fepkg/services/apis';
import type { QuotePrice } from '@fepkg/services/types/bond-optimal-quote/get-optimal-price';
import { ProductType, Side } from '@fepkg/services/types/enum';
import { context } from '@opentelemetry/api';
import { fetchBondOptimalQuoteGetOptimalPrice } from '@/common/services/api/bond-optimal-quote/get-optimal-price';
import { logger } from '@/common/utils/logger';

export type DblSideQuotePrice = { [Side.SideBid]?: Partial<QuotePrice>; [Side.SideOfr]?: Partial<QuotePrice> };
export type OptimalQuotePriceMap = { [key: string]: DblSideQuotePrice };

export type OptimalPriceQueryVars = {
  productType: ProductType;
  keyMarketList: string[];
  excludeQuoteId?: string;
};

const checkOptimalPriceValid = (optimalPrice?: QuotePrice, excludeQuoteId?: string) => {
  if (optimalPrice?.quote_price === undefined || (!!excludeQuoteId && optimalPrice?.quote_id === excludeQuoteId)) {
    return false;
  }
  return true;
};

export const useOptimalPriceQuery = createQuery<OptimalQuotePriceMap, OptimalPriceQueryVars>({
  primaryKey: APIs.bondOptimalQuote.getOptimalPrice,
  queryFn: async ({ signal, queryKey: [, vars] }) => {
    const { productType, keyMarketList, excludeQuoteId } = vars;
    const map: OptimalQuotePriceMap = {};
    const ctx = context.active();

    logger.ctxInfo(ctx, `[useOptimalPriceQuery] query optimal price for keyMarketList=${keyMarketList}`);

    try {
      const { optimal_price_list_v2 = [] } = await fetchBondOptimalQuoteGetOptimalPrice(
        { product_type: productType, key_market_list: keyMarketList },
        { signal, traceCtx: ctx }
      );

      for (const price of optimal_price_list_v2) {
        const { bid_optimal_price, ofr_optimal_price } = price;

        const bidOptimalPrice = bid_optimal_price?.filter(item => checkOptimalPriceValid(item, excludeQuoteId))?.at(0);
        const ofrOptimalPrice = ofr_optimal_price?.filter(item => checkOptimalPriceValid(item, excludeQuoteId))?.at(0);

        map[price.bond_key_market] = {
          [Side.SideBid]: bidOptimalPrice,
          [Side.SideOfr]: ofrOptimalPrice
        };
      }

      logger.ctxInfo(ctx, `[useOptimalPriceQuery] optimal price map=${JSON.stringify(map)}`);
    } catch (err) {
      logger.ctxError(ctx, `[useOptimalPriceQuery] failed get optimal price, exception=${err}`);
    }

    return map;
  },
  refetchOnWindowFocus: true,
  enabled: (_, vars) => !!vars.keyMarketList?.length
});
