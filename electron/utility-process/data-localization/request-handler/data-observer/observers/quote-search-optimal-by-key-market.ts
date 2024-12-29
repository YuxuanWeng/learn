import type { LocalQuoteSearchOptimalByKeyMarket } from '@fepkg/services/types/data-localization-manual/quote/search-optimal-by-key-market';
import { QuoteRealtimeMessage } from 'app/packages/data-sync-manager/types';
import { EventClientChannel } from 'app/packages/event-client/types';
import { DataLocalizationAction } from 'app/types/DataLocalization';
import { isEqual } from 'lodash-es';
import { v4 } from 'uuid';
import { BaseObserver, CommonObserverArr } from '../base';
import { DataObserverConfig } from '../type';

export class QuoteSearchOptimalByKeyMarketObserver extends BaseObserver<
  LocalQuoteSearchOptimalByKeyMarket.Request,
  LocalQuoteSearchOptimalByKeyMarket.Response
> {
  protected queryFn = this.dataController.quoteSearchOptimalByKeyMarket.bind(this.dataController);

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
      const bondKeyMarketList = (ctx ?? []).map(item => item.bond_key_market);

      if (Array.isArray(bondKeyMarketList) && bondKeyMarketList.length) {
        // 需要被通知的有更新的 KeyMarket 列表
        const observerMap = this.getObserverMap();

        observerMap?.forEach((data, observerId) => {
          const [portId, requestParams, oldValue] = data ?? [];

          // 空参数意味着渲染进程没发起过查询，无需推送更新
          if (!portId || !requestParams || !oldValue) {
            return;
          }
          // keyMarket没被监听的话无需更新
          if (!oldValue?.key_market || !bondKeyMarketList.includes(oldValue.key_market)) {
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
