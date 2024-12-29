import type { BaseResponse } from '../common';
import { ImMsgSendStatus } from '../enum';

/**
 * @description qq发送消息前端回调
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/qq/send_msg_callback
 */
export declare namespace BaseQqSendMsgCallback {
  type Request = {
    msg_list?: Msg[];
  };

  type Response = {
    base_response: BaseResponse;
  };

  export type Msg = {
    message_id: string; // 消息id
    code: ImMsgSendStatus; // 状态
    msg: string; // 错误信息
  };
}
