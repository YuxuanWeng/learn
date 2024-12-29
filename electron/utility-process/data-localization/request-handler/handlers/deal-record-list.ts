import { StatusCode } from '@fepkg/request/types';
import type { LocalDealRecordList } from '@fepkg/services/types/data-localization-manual/deal-info/record-list';
import { DataLocalizationAction, DataLocalizationRequest } from 'app/types/DataLocalization';
import { logError } from '../../utils';
import { DealRecordListObserver } from '../data-observer/observers/deal-record-list';
import { LiveRequestHandler } from '../live';
import { RequestHandlerConfig } from '../types';

export class DealRecordListRequestHandler extends LiveRequestHandler<
  LocalDealRecordList.Request,
  LocalDealRecordList.Response
> {
  protected action = DataLocalizationAction.DealRecordList;

  protected queryFn = this.dataController.dealRecordList.bind(this.dataController);

  protected dataObserver: DealRecordListObserver;

  constructor(config: RequestHandlerConfig) {
    super(config);
    this.dataObserver = new DealRecordListObserver(config);
  }

  removeAllObservers(): void {
    this.dataObserver.removeAllObservers();
  }

  liveExecute(portId: number, data: DataLocalizationRequest<LocalDealRecordList.Request>, portIds: number[]) {
    const { action, value, local_request_trace_id } = data ?? {};
    try {
      if (action !== this.action) {
        throw new Error(`EventHandler:${action} is invalid.`);
      }
      if (!value) throw new Error(`${action} params is undefined.`);

      const { observer_id, type, product_type, broker_list, deal_time, observer_id_list } = value;

      if (type === 'remove' && observer_id) {
        this.dataObserver.removeObserverMap(observer_id);
        return;
      }
      if (type === 'sync') {
        this.dataObserver.removeSlackObservers([portId, observer_id_list], portIds);
        return;
      }

      if (!observer_id) throw new Error(`${action} params is invalid.`);

      const queryKey = { product_type, broker_list, deal_time };

      // 早于查询就注册相应observer
      const beforeObserver = this.dataObserver.getObserverMapById(observer_id);
      if (beforeObserver === undefined) {
        this.dataObserver.setObserverMapById(observer_id, [portId, queryKey, undefined]);
      }

      const result = this.queryFn(value);

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
