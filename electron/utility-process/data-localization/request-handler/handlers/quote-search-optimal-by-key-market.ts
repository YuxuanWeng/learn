import { StatusCode } from '@fepkg/request/types';
import type { LocalQuoteSearchOptimalByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-optimal-by-key-market';
import { DataLocalizationAction, DataLocalizationRequest } from 'app/types/DataLocalization';
import { logError } from '../../utils';
import { QuoteSearchOptimalByKeyMarketObserver } from '../data-observer/observers/quote-search-optimal-by-key-market';
import { LiveRequestHandler } from '../live';
import { RequestHandlerConfig } from '../types';

export class QuoteSearchOptimalByKeyMarketRequestHandler extends LiveRequestHandler<
  LocalQuoteSearchOptimalByKeyMarket.Request,
  LocalQuoteSearchOptimalByKeyMarket.Response
> {
  protected action = DataLocalizationAction.QuoteSearchOptimalByKeyMarket;

  protected queryFn = this.dataController.quoteSearchOptimalByKeyMarket.bind(this.dataController);

  protected dataObserver: QuoteSearchOptimalByKeyMarketObserver;

  constructor(config: RequestHandlerConfig) {
    super(config);
    this.dataObserver = new QuoteSearchOptimalByKeyMarketObserver(config);
  }

  removeAllObservers(): void {
    this.dataObserver.removeAllObservers();
  }

  liveExecute(
    portId: number,
    data: DataLocalizationRequest<LocalQuoteSearchOptimalByKeyMarket.Request>,
    portIds: number[]
  ) {
    const { action, value, local_request_trace_id } = data ?? {};
    try {
      if (action !== this.action) {
        throw new Error(`EventHandler:${action} is invalid.`);
      }
      if (!value) throw new Error(`${action} params is undefined.`);

      const { key_market, broker_id, spot_date, observer_id, type, observer_id_list, ignore_retail } = value;

      if (type === 'remove' && observer_id) {
        this.dataObserver.removeObserverMap(observer_id);
        return;
      }
      if (type === 'sync') {
        this.dataObserver.removeSlackObservers([portId, observer_id_list], portIds);
        return;
      }

      if (!observer_id) throw new Error(`${action} params is invalid.`);

      const queryKey = { key_market, broker_id, spot_date, ignore_retail };

      // 早于查询就注册相应observer
      const beforeObserver = this.dataObserver.getObserverMapById(observer_id);
      if (beforeObserver === undefined) {
        this.dataObserver.setObserverMapById(observer_id, [portId, queryKey, undefined]);
      }

      const result = this.queryFn(queryKey);

      // 更新observer下的value
      const afterObserver = this.dataObserver.getObserverMapById(observer_id);
      if (Array.isArray(afterObserver)) {
        this.dataObserver.setObserverMapById(observer_id, [portId, queryKey, result]);
      }

      this.getPostToRenderFn(portId)(action, local_request_trace_id, result);
    } catch (error) {
      this.getPostToRenderFn(portId)(action, local_request_trace_id, {
        base_response: { code: StatusCode.InternalError, msg: (error as Error)?.message ?? '' }
      });
      logError(error);
    }
  }
}
