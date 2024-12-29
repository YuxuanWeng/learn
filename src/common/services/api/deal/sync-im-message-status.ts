import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealSyncImMsgStatus } from '@fepkg/services/types/deal/sync-im-msg-status';
import request from '@/common/request';

/**
 * @description 同步发送信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/sync_im_message_status
 */
export const dealSyncImMessageStatus = (params: DealSyncImMsgStatus.Request, config?: RequestConfig) => {
  return request.post<DealSyncImMsgStatus.Response>(APIs.deal.syncImMessageStatus, params, config);
};
