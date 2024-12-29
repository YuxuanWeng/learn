import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealRecordSendMsgCallback } from '@fepkg/services/types/deal/record-send-msg-callback';
import request from '@/common/request';

/**
 * @description 发送消息通知
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/send_msg_callback
 */
export const recordSendMsgCallback = (params: DealRecordSendMsgCallback.Request, config?: RequestConfig) => {
  return request.post<DealRecordSendMsgCallback.Response>(APIs.deal.recordSendMsgCallback, params, config);
};
