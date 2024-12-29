import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { OppositePriceNotificationTraderSettingGet } from '@fepkg/services/types/opposite-price-notification/trader-setting-get';
import request from '@/common/request';

/**
 * @description 根据经纪人id获取对价提醒-交易员渠道信息
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/trader_setting/get
 */

export const fetchTraderSetting = (
  params: OppositePriceNotificationTraderSettingGet.Request,
  config?: RequestConfig
) => {
  return request.post<OppositePriceNotificationTraderSettingGet.Response>(
    APIs.oppositePriceNotification.traderSetting.get,
    params,
    config
  );
};
