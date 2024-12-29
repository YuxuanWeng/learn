import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealPayForInstFeeUpdate } from '@fepkg/services/types/deal/pay-for-inst-fee-update';
import request from '@/common/request';

/**
 * @description 创建/更新代付机构费用设置
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/fee_update
 */
export const updatePayForInstFee = (params: DealPayForInstFeeUpdate.Request, config?: RequestConfig) => {
  return request.post<DealPayForInstFeeUpdate.Response>(APIs.deal.payForInstFeeUpdate, params, config);
};
