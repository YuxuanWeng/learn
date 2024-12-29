import type { BaseResponse } from '../common';

/**
 * @description 修改密码
 * @method POST
 * @url /api/v1/bdm/base/auth_api/password/update
 */
export declare namespace PasswordUpdate {
  type Request = {
    password: string; // 密码
    new_password: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
