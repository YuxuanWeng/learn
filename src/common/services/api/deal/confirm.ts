import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealRecordConfirm } from '@fepkg/services/types/deal/record-confirm';
import request from '@/common/request';

/**
 * @description 成交确认
 * @url /api/v1/bdm/bds/bds_api/deal/record/confirm
 */
export const idcDealConfirm = (params: DealRecordConfirm.Request, config?: RequestConfig) => {
  return request.post<DealRecordConfirm.Response>(APIs.deal.recordConfirm, params, config);
};
