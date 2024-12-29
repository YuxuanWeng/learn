import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealPayForInstGet } from '@fepkg/services/types/deal/pay-for-inst-get';
import request from '@/common/request';

/**
 * @description 获取机构的代付机构信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/get
 */
export const fetchPayForInstList = (params: DealPayForInstGet.Request, config?: RequestConfig) => {
  return request.post<DealPayForInstGet.Response>(APIs.deal.payForInstGet, params, config);
};
