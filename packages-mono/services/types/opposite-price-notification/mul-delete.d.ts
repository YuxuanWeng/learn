import type { BaseResponse } from '../common';

/**
 * @description 批量删除对价提醒
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/mul_delete
 */
export declare namespace OppositePriceNotificationMulDelete {
  type Request = {
    notification_id_list?: string[]; // 对价提醒id列表
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
