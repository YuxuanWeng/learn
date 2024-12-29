import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealRecordClone } from '@fepkg/services/types/deal/record-clone';
import request from '@/common/request';

/**
 * @description 成交克隆
 * @url /api/v1/bdm/bds/bds_api/deal/record/clone
 */
export const idcDealClone = (params: DealRecordClone.Request, config?: RequestConfig) => {
  return request.post<DealRecordClone.Response>(APIs.deal.recordClone, params, config);
};
