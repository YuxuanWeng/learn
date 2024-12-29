import { LocalDealRecordList } from '@fepkg/services/types/data-localization-manual/deal-info/record-list';
import { DealRealtimeMessage } from 'app/packages/data-sync-manager/types';
import { EventClientChannel } from 'app/packages/event-client/types';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { isEqual } from 'lodash-es';
import { v4 } from 'uuid';
import { BaseObserver } from '../base';
import { DataObserverConfig } from '../type';

export const DealRecordObserverArr = [
  EventClientChannel.TraderRealtime,
  EventClientChannel.UserRealtime,
  EventClientChannel.BondDetailRealtime
] as const;

export class DealRecordListObserver extends BaseObserver<LocalDealRecordList.Request, LocalDealRecordList.Response> {
  protected queryFn = this.dataController.dealRecordList.bind(this.dataController);

  constructor(config: DataObserverConfig) {
    super(config);
    const commonConfig = {
      observerMap: this.observerMap,
      queryFn: this.queryFn
    };

    this.observerQuoteSyncStateChange();

    DealRecordObserverArr.forEach(channel => this.observerStateChange({ ...commonConfig, channel }));
  }

  private observerQuoteSyncStateChange() {
    const eventClient = this.getEventClient();

    eventClient.on<DealRealtimeMessage[]>(EventClientChannel.DealRealtime, ctx => {
      const dealIdList = (ctx ?? []).map(item => item.deal_id);

      if (dealIdList.length) {
        // 需要被通知的有更新的 KeyMarket 列表
        const observerMap = this.getObserverMap();

        observerMap?.forEach((data, observerId) => {
          const [portId, requestParams, oldValue] = data ?? [];

          // 空参数意味着渲染进程没发起过查询，无需推送更新
          if (!portId || !requestParams || !oldValue) {
            return;
          }

          const newValue = this.queryFn(requestParams);

          if (!isEqual(newValue, oldValue)) {
            this.setObserverMapById(observerId, [portId, requestParams, newValue]);
            // 通知给渲染进程
            this.getPostToRenderFn(portId)(DataLocalizationAction.LiveDataUpdate, v4(), {
              status: 'success',
              notified_list: [[observerId, newValue]]
            });
          }
        });
      }
    });
  }
}
