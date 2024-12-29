import type { BaseResponse } from '../common';

/**
 * @description 更新地区信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/district_info/update
 */
export declare namespace DistrictInfoUpdate {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
