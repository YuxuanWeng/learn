import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { OppositePriceNotificationMulUpdate } from '@fepkg/services/types/opposite-price-notification/mul-update';
import request from '@/common/request';

/**
 * @description 批量更新当前经纪人对价提醒发送状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/mul_update
 */

export const mulUpdateOppositePriceNotification = (
  param: OppositePriceNotificationMulUpdate.Request,
  config?: RequestConfig
) => {
  return request.post<OppositePriceNotificationMulUpdate.Response>(
    APIs.oppositePriceNotification.mulUpdate,
    param,
    config
  );
};
