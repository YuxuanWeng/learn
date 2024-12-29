import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealPayForInstFeeGet } from '@fepkg/services/types/deal/pay-for-inst-fee-get';
import request from '@/common/request';

/**
 * @description 获取机构费用设置
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/fee_get
 */
export const fetchPayForInstFee = (params: DealPayForInstFeeGet.Request, config?: RequestConfig) => {
  return request.post<DealPayForInstFeeGet.Response>(APIs.deal.payForInstFeeGet, params, config);
};
