import type { BaseResponse } from '../common';
import { UserOSType } from '../enum';

/**
 * @description 设置最新版本信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/latest_version/set
 */
export declare namespace LatestVersionSet {
  type Request = {
    version_info: string;
    user_os_type: UserOSType;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
