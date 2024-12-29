import type { BaseResponse } from '../common';

export type UpdatePayForInstStatus = {
  inst_id: string;
  is_pay_for_status: boolean;
};

/**
 * @description 更新是否为代付机构状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/pay_for_inst/status_update
 */
export declare namespace DealPayForInstStatusUpdate {
  type Request = {
    update_structs?: UpdatePayForInstStatus[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
