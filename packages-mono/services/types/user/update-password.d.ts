import type { BaseResponse } from '../common';

/**
 * @description 更新密码
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/password/update
 */
export declare namespace UserUpdatePassword {
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
