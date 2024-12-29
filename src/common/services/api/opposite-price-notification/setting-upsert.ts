import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { OppositePriceNotificationSettingUpsert } from '@fepkg/services/types/opposite-price-notification/setting-upsert';
import request from '@/common/request';

/**
 * @description 修改当前经纪人对价提醒设置，只传入需要修改的值;如果当前用户无配置，则转为新增，无值字段取默认值
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/setting/upsert
 */
export const updateOppositePriceNotificationSetting = (
  params: OppositePriceNotificationSettingUpsert.Request,
  config?: RequestConfig
) => {
  return request.post<OppositePriceNotificationSettingUpsert.Response>(
    APIs.oppositePriceNotification.setting.upsert,
    params,
    config
  );
};
