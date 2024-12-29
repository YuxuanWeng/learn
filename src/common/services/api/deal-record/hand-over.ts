import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealRecordHandOver } from '@fepkg/services/types/deal/record-hand-over';
import request from '@/common/request';

/**
 * @description 成交单点移交
 * @url /api/v1/bdm/bds/bds_api/deal/record/hand_over
 */
export const handOverDealRecord = (params: DealRecordHandOver.Request, config?: RequestConfig) => {
  return request.post<DealRecordHandOver.Response>(APIs.deal.recordHandOver, params, config);
};
