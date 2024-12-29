import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { OppositePriceNotificationMulDelete } from '@fepkg/services/types/opposite-price-notification/mul-delete';
import request from '@/common/request';

/**
 * @description 批量删除对价提醒
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/mul_delete
 */
export const mulDeleteOppositePriceNotification = (
  param: OppositePriceNotificationMulDelete.Request,
  config?: RequestConfig
) => {
  return request.post<OppositePriceNotificationMulDelete.Response>(
    APIs.oppositePriceNotification.mulDelete,
    param,
    config
  );
};
