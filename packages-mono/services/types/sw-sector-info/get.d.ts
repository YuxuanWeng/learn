import type { BaseResponse, Sector } from '../common';

/**
 * @description 获取行业信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/sw_sector_info/get
 */
export declare namespace SwSectorInfoGet {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    sectors?: Sector[];
    base_response?: BaseResponse;
  };
}
