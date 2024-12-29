import type { BaseResponse } from '../common';
import { UserOSType } from '../enum';

/**
 * @description 获取最新版本信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/latest_version/get
 */
export declare namespace LatestVersionGet {
  type Request = {
    user_os_type: UserOSType;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    version_info: string;
    base_response?: BaseResponse;
  };
}
