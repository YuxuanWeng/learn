import type { BaseResponse } from '../common';

/**
 * @description 消息置为已读
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/message/mul_read
 */
export declare namespace MessageMulRead {
  type Request = {
    message_id_list?: string[]; // 根据id置为已读
    read_time?: string; // 根据时间全部置为已读
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
