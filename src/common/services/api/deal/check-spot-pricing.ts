import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealRecordCheck } from '@fepkg/services/types/deal/record-check';
import request from '@/common/request';

/**
 * @description 校验n秒内有没有成交记录
 * @url /api/v1/bdm/bds/bds_api/deal/record/check
 */
export const idcDealCheckSpotPricing = (params: DealRecordCheck.Request, config?: RequestConfig) => {
  return request.post<DealRecordCheck.Response>(APIs.deal.recordCheck, params, config);
};
