import type { BaseResponse } from '../common';

/**
 * @description 删除消息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/message/mul_delete
 */
export declare namespace MessageMulDelete {
  type Request = {
    message_id_list?: string[];
    delete_time?: string; // 根据时间全部置为删除
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
