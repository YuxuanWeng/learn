import type { BaseResponse, Province } from '../common';

/**
 * @description 获取地区信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/district_info/get
 */
export declare namespace DistrictInfoGet {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    provinces?: Province[];
    base_response?: BaseResponse;
  };
}
