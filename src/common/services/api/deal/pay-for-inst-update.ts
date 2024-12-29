import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealPayForInstStatusUpdate } from '@fepkg/services/types/deal/pay-for-inst-status-update';
import request from '@/common/request';

/**
 * @description 更新是否为代付机构状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/status_update
 */
export const updatePayForInstState = (params: DealPayForInstStatusUpdate.Request, config?: RequestConfig) => {
  return request.post<DealPayForInstStatusUpdate.Response>(APIs.deal.payForInstStatusUpdate, params, config);
};
