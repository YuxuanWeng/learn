import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { OppositePriceNotificationSettingGet } from '@fepkg/services/types/opposite-price-notification/setting-get';
import request from '@/common/request';

/**
 * @description 根据当前经纪人获取对价提醒设置
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/setting/get
 */
export const fetchOppositePriceNotificationSetting = (
  params: OppositePriceNotificationSettingGet.Request,
  config?: RequestConfig
) => {
  return request.post<OppositePriceNotificationSettingGet.Response>(
    APIs.oppositePriceNotification.setting.get,
    params,
    config
  );
};
