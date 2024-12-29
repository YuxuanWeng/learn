import type { BaseResponse } from '../common';

/**
 * @description 标记提示通知已读
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/notify/mark_read
 */
export declare namespace DealNotifyMarkRead {
  type Request = {
    notify_id_list?: string[]; // 提示通知ID
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
