import { QuoteSync } from '@fepkg/services/types/common';
import { LocalQuoteSearchById } from '@fepkg/services/types/data-localization-manual/quote/search-by-id';
import type { LocalQuoteSearchByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-by-key-market';
import type { LocalQuoteSearchOptimalByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-optimal-by-key-market';
import { InstReadableDao } from '../../database-client/dao/readable/inst';
import { QuoteReadableDao } from '../../database-client/dao/readable/quote';
import { TraderReadableDao } from '../../database-client/dao/readable/trader';
import { UserReadableDao } from '../../database-client/dao/readable/user';
import { Service2SyncDataTypeMap, ServiceType } from '../common';
import { RealtimeService } from '../realtime';
import { RealtimeServiceConfig } from '../types';
import {
  classifyGridBySpotDate,
  formatQuoteSync2DealQuote,
  getIdcOptimalPriceQuotes,
  quoteSortByUpdateTime,
  quoteSortOptimal
} from '../utils';

export class QuoteService extends RealtimeService {
  private quoteDao: QuoteReadableDao;

  private instDao: InstReadableDao;

  private traderDao: TraderReadableDao;

  private userDao: UserReadableDao;

  constructor(config: RealtimeServiceConfig) {
    super({ ...config, syncDataTypeList: Service2SyncDataTypeMap[ServiceType.QuoteService] });
    const { databaseClient } = config;
    this.quoteDao = new QuoteReadableDao(databaseClient);
    this.instDao = new InstReadableDao(databaseClient);
    this.traderDao = new TraderReadableDao(databaseClient);
    this.userDao = new UserReadableDao(databaseClient);
  }

  searchOptimalByKeyMarket(
    params: LocalQuoteSearchOptimalByKeyMarket.Request
  ): LocalQuoteSearchOptimalByKeyMarket.Response {
    const { key_market, broker_id, spot_date, ignore_retail } = params;

    const quoteList = this.quoteDao.selectByKeyMarketBroker(key_market, broker_id, ignore_retail);

    const { instMap, traderMap, userMap } = this.getAssociatedData(quoteList);

    let resultList = quoteList.map(q =>
      formatQuoteSync2DealQuote({
        quote: q,
        inst: instMap.get(q.inst_id ?? '') ?? { inst_id: q.inst_id },
        trader: traderMap.get(q.trader_id ?? '') ?? { trader_id: q.trader_id },
        broker: userMap.get(q.broker_id ?? '') ?? { user_id: q.broker_id }
      })
    );

    // 按清算速度过滤
    if (spot_date) {
      resultList = resultList.filter(quote => classifyGridBySpotDate(quote, spot_date));
    }
    // 排序
    const [bidList, ofrList] = quoteSortOptimal(resultList);
    // 筛选最优次优、过滤无价无量
    const [bid_optimal_quote_list, bid_suboptimal_quote_list] = getIdcOptimalPriceQuotes(bidList);
    const [ofr_optimal_quote_list, ofr_suboptimal_quote_list] = getIdcOptimalPriceQuotes(ofrList);
    return {
      key_market,
      spot_date,
      broker_id,
      bid_optimal_quote_list,
      bid_suboptimal_quote_list,
      ofr_optimal_quote_list,
      ofr_suboptimal_quote_list
    };
  }

  searchByKeyMarket(params: LocalQuoteSearchByKeyMarket.Request): LocalQuoteSearchByKeyMarket.Response {
    const { key_market, broker_id, spot_date } = params;

    const quoteList = this.quoteDao.selectByKeyMarketBroker(key_market, broker_id);

    const { instMap, traderMap, userMap } = this.getAssociatedData(quoteList);

    let resultList = quoteList.map(q =>
      formatQuoteSync2DealQuote({
        quote: q,
        inst: instMap.get(q.inst_id ?? '') ?? { inst_id: q.inst_id },
        trader: traderMap.get(q.trader_id ?? '') ?? { trader_id: q.trader_id },
        broker: userMap.get(q.broker_id ?? '') ?? { user_id: q.broker_id }
      })
    );

    // 按清算速度过滤
    if (spot_date) {
      resultList = resultList.filter(quote => classifyGridBySpotDate(quote, spot_date));
    }

    // 不过滤无价无量
    return {
      key_market,
      broker_id,
      spot_date,
      quote_list: quoteSortByUpdateTime(resultList)
    };
  }

  searchById(params: LocalQuoteSearchById.Request): LocalQuoteSearchById.Response {
    const { quote_id } = params;
    const quote = this.quoteDao.searchById(quote_id);

    if (!quote) {
      return { quote: void 0 };
    }
    const { instMap, traderMap, userMap } = this.getAssociatedData([quote]);

    const result = formatQuoteSync2DealQuote({
      quote,
      inst: instMap.get(quote.inst_id ?? '') ?? { inst_id: quote.inst_id },
      trader: traderMap.get(quote.trader_id ?? '') ?? { trader_id: quote.trader_id },
      broker: userMap.get(quote.broker_id ?? '') ?? { user_id: quote.broker_id }
    });

    return {
      quote: result
    };
  }

  private getAssociatedData(quoteList: QuoteSync[]) {
    const instIdSet = new Set<string>();
    const traderIdSet = new Set<string>();
    const userIdSet = new Set<string>();

    for (const quote of quoteList) {
      if (quote.inst_id) instIdSet.add(quote.inst_id);
      if (quote.trader_id) traderIdSet.add(quote.trader_id);
      if (quote.broker_id) userIdSet.add(quote.broker_id);
    }

    const instMap = this.instDao.getInstMapByIdSet(instIdSet, undefined, true);
    const traderMap = this.traderDao.getTraderMapByIdSet(traderIdSet, true);
    const userMap = this.userDao.getUserMapByIdSet(userIdSet, undefined, true);

    return {
      instMap,
      traderMap,
      userMap
    };
  }
}
