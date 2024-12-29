import type { BaseResponse } from '../common';

/**
 * @description 登陆鉴权
 * @method POST
 * @url /api/v1/bdm/base/auth_api/login
 */
export declare namespace Login {
  type Request = {
    user_name: string;
    password: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    user_id: string;
    token: string;
    base_response?: BaseResponse;
  };
}
