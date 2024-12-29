import type { BaseResponse } from '../common';
import { UrgeStatus } from '../enum';

/**
 * @description 催单
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/child_deal/urge
 */
export declare namespace ChildDealUrge {
  type Request = {
    child_deal_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    urge_status: UrgeStatus;
  };
}
