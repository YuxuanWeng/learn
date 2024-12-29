import type { BaseResponse } from '../common';
import { ImMsgSendStatus } from '../enum';

/**
 * @description 批量更新当前经纪人对价提醒发送状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/opposite_price_notification/mul_update
 */
export declare namespace OppositePriceNotificationMulUpdate {
  type Request = {
    update_list?: OppositePriceNotificationMarkSent[];
  };

  type Response = {
    base_response?: BaseResponse;
  };

  export type OppositePriceNotificationMarkSent = {
    notification_id: string; // 对价提醒id
    send_status: ImMsgSendStatus; // 发送状态
    send_failed_reason?: string; // 发送失败原因
  };
}
