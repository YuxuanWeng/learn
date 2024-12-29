import type { BaseResponse, Message } from '../common';

/**
 * @description 获取消息列表，返回最近两天内的近200条，若这200条有n条被删除，返回200-n条
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/message/mul_get
 */
export declare namespace MessageMulGet {
  type Request = {
    // None in here...
  };

  type Response = {
    base_response?: BaseResponse;
    message_list?: Message[];
  };
}
