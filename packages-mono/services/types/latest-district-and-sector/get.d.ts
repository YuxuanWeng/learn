import type { BaseResponse } from '../common';

/**
 * @description 获取最新地区行业信息字符串，以便于更新bds_api的地区行业缓存数据。
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/latest_district_and_sector/get
 */
export declare namespace LatestDistrictAndSectorGet {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    district: string;
    sector: string;
    base_response?: BaseResponse;
  };
}
