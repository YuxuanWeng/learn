import type { BaseResponse } from '../common';

/**
 * @description 退出
 * @method POST
 * @url /api/v1/bdm/base/auth_api/logout
 */
export declare namespace Logout {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
