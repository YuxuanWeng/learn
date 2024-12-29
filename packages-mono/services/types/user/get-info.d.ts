import type { BaseResponse, User } from '../common';

/**
 * @description 查看个人信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/info/get
 */
export declare namespace UserGetInfo {
  type Request = {
    user_ids?: string[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    user_list?: User[];
    base_response?: BaseResponse;
  };
}
