import type { BaseResponse, DealUnreadNotify } from '../common';

/**
 * @description 获取所有未读提示通知
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/notify/unread/get_all
 */
export declare namespace DealNotifyUnreadGetAll {
  type Request = {
    // None in here...
  };

  type Response = {
    base_response?: BaseResponse;
    unread_notify_list?: DealUnreadNotify[];
  };
}
