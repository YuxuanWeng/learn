import type { BaseResponse, DealOperationInfo } from '../common';

/**
 * @description 发送消息通知
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/send_msg_callback
 */
export declare namespace DealRecordSendMsgCallback {
  type Request = {
    deal_id: string;
    operation_info: DealOperationInfo; // 操作类型
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
