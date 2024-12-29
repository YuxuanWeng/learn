import { LocalQuoteSearchById } from '@fepkg/services/types/data-localization-manual/quote/search-by-id';
import { QuoteRealtimeMessage } from 'app/packages/data-sync-manager/types';
import { EventClientChannel } from 'app/packages/event-client/types';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { isEqual } from 'lodash-es';
import { v4 } from 'uuid';
import { BaseObserver, CommonObserverArr } from '../base';
import { DataObserverConfig } from '../type';

export class QuoteSearchByIdObserver extends BaseObserver<LocalQuoteSearchById.Request, LocalQuoteSearchById.Response> {
  protected queryFn = this.dataController.quoteSearchById.bind(this.dataController);

  constructor(config: DataObserverConfig) {
    super(config);
    const commonConfig = {
      observerMap: this.observerMap,
      queryFn: this.queryFn
    };

    this.observerQuoteSyncStateChange();

    CommonObserverArr.forEach(channel => this.observerStateChange({ ...commonConfig, channel }));
  }

  private observerQuoteSyncStateChange() {
    const eventClient = this.getEventClient();

    eventClient.on<QuoteRealtimeMessage[]>(EventClientChannel.QuoteRealtime, ctx => {
      const quoteIdList = (ctx ?? []).map(item => item.quote_id);

      if (quoteIdList.length) {
        // 需要被通知的有更新的 KeyMarket 列表
        const observerMap = this.getObserverMap();

        observerMap?.forEach((data, observerId) => {
          const [portId, requestParams, oldValue] = data ?? [];

          // 空参数意味着渲染进程没发起过查询，无需推送更新
          if (!portId || !requestParams || !oldValue) {
            return;
          }
          // keyMarket没被监听的话无需更新
          if (!oldValue?.quote || !quoteIdList.includes(oldValue.quote.quote_id)) {
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
