import type { BaseResponse, User } from '../common';

/**
 * @description 检查登陆状态
 * @method POST
 * @url /api/v1/bdm/base/auth_api/check_login
 */
export declare namespace CheckLogin {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    user?: User;
    base_response?: BaseResponse;
  };
}
