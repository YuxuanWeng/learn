import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealRecordCreate } from '@fepkg/services/types/deal/record-create';
import request from '@/common/request';

/**
 * @description 创建成交单
 * @url /api/v1/bdm/bds/bds_api/deal/record/create
 */
export const idcDealCreateSpotPricingRecord = (params: DealRecordCreate.Request, config?: RequestConfig) => {
  return request.post<DealRecordCreate.Response>(APIs.deal.recordCreate, params, config);
};
