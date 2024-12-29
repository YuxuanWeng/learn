import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { OppositePriceNotificationTraderSettingUpdate } from '@fepkg/services/types/opposite-price-notification/trader-setting-update';
import request from '@/common/request';

/**
 * @description 修改经纪人对价提醒-交易员渠道信息
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/trader_setting/update
 */
export const updateTraderSetting = (
  params: OppositePriceNotificationTraderSettingUpdate.Request,
  config?: RequestConfig
) => {
  return request.post<OppositePriceNotificationTraderSettingUpdate.Response>(
    APIs.oppositePriceNotification.traderSetting.update,
    params,
    config
  );
};
