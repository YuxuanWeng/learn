import type { BaseResponse, UserAccess } from '../common';

/**
 * @description 管理员批量获取用户权限列表
 * @method POST
 * @url /api/v1/bdm/crm/api/access/user/mul_get
 */
export declare namespace AccessUserMulGet {
  type Request = {
    user_id_list?: string[]; // 用户ids
  };

  type Response = {
    status_code: number;
    status_msg: string;
    user_access_list?: UserAccess[];
    base_response?: BaseResponse;
  };
}
