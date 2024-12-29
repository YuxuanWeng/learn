import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealRecordUpdate } from '@fepkg/services/types/deal/record-update';
import request from '@/common/request';

/**
 * @description 单条修改
 * @url /api/v1/bdm/bds/bds_api/deal/record/update
 */
export const updateDealRecord = (params: DealRecordUpdate.Request, config?: RequestConfig) => {
  return request.post<DealRecordUpdate.Response>(APIs.deal.recordUpdate, params, config);
};
