import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealNotifyMarkRead } from '@fepkg/services/types/deal/notify-mark-read';
import request from '@/common/request';

/**
 * @description 标记提示通知已读
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/notify/mark_read
 */
export const dealNotifyMarkRead = (params: DealNotifyMarkRead.Request, config?: RequestConfig) => {
  return request.post<DealNotifyMarkRead.Response>(APIs.deal.notifyMarkRead, params, config);
};
