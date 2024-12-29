import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealOfflineDealMulCreate } from '@fepkg/services/types/deal/offline-deal-mul-create';
import request from '@/common/request';

/**
 * @description 线下成交录入
 * @url /api/v1/bdm/bds/bds_api/deal/offline_deal/mul_create
 */
export const idcDealOfflineMulCreate = (params: DealOfflineDealMulCreate.Request, config?: RequestConfig) => {
  return request.post<DealOfflineDealMulCreate.Response>(APIs.deal.offlineDealMulCreate, params, config);
};
