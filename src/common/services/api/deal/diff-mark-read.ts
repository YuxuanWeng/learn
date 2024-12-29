import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealDealInfoMarkReadStatus } from '@fepkg/services/types/deal/deal-info-mark-read-status';
import request from '@/common/request';

/**
 * @description 将某方修改变更设置为已知
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/deal_info/mark_read_status
 */
export const dealDiffMarkRead = (params: DealDealInfoMarkReadStatus.Request, config?: RequestConfig) => {
  return request.post<DealDealInfoMarkReadStatus.Response>(APIs.deal.dealInfoMarkReadStatus, params, config);
};
