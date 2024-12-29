import { StatusCode } from '@fepkg/request/types';
import type { LocalQuoteDraftMessageList } from '@fepkg/services/types/data-localization-manual/quote-draft-message/list';
import { DataLocalizationAction, DataLocalizationRequest } from 'app/types/DataLocalization';
import { logError } from '../../utils';
import { QuoteDraftMessageListObserver } from '../data-observer/observers/quote-draft-message-list';
import { LiveRequestHandler } from '../live';
import { RequestHandlerConfig } from '../types';

export class QuoteDraftMessageListRequestHandler extends LiveRequestHandler<
  LocalQuoteDraftMessageList.Request,
  LocalQuoteDraftMessageList.Response
> {
  protected action = DataLocalizationAction.QuoteDraftMessageList;

  protected queryFn = this.dataController.quoteDraftMessageList.bind(this.dataController);

  protected dataObserver: QuoteDraftMessageListObserver;

  constructor(config: RequestHandlerConfig) {
    super(config);
    this.dataObserver = new QuoteDraftMessageListObserver(config);
  }

  removeAllObservers(): void {
    this.dataObserver.removeAllObservers();
  }

  liveExecute(portId: number, data: DataLocalizationRequest<LocalQuoteDraftMessageList.Request>, portIds: number[]) {
    const { action, value, local_request_trace_id } = data ?? {};
    try {
      if (action !== this.action) {
        throw new Error(`EventHandler:${action} is invalid.`);
      }
      if (!value) throw new Error(`${action} params is undefined.`);

      const {
        observer_id,
        type,
        user_id: userId,
        product_type,
        creator_list,
        status,
        offset,
        count,
        timestamp,
        observer_id_list,
        observer_disabled
      } = value;

      if (type === 'remove' && observer_id) {
        this.dataObserver.removeObserverMap(observer_id);
        return;
      }

      if (type === 'sync') {
        this.dataObserver.removeSlackObservers([portId, observer_id_list], portIds);
        return;
      }

      if (!observer_id) throw new Error(`${action} params is invalid.`);

      const queryKey = {
        observer_id,
        userId,
        product_type,
        creator_list,
        status,
        offset,
        count,
        timestamp,
        observer_disabled
      };

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
