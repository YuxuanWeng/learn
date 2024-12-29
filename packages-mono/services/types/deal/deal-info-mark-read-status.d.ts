import type { BaseResponse } from '../common';

/**
 * @description 将某方修改变更设置为已知
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/deal_info/mark_read_status
 */
export declare namespace DealDealInfoMarkReadStatus {
  type Request = {
    deal_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
