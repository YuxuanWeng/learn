import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { OppositePriceNotificationGet } from '@fepkg/services/types/opposite-price-notification/get';
import request from '@/common/request';

/**
 * @description 根据当前经纪人批量获取对价提醒
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/get
 */
export const batchFetchOppositePriceNotification = (
  param: OppositePriceNotificationGet.Request,
  config?: RequestConfig
) => {
  return request.post<OppositePriceNotificationGet.Response>(APIs.oppositePriceNotification.get, param, config);
};
