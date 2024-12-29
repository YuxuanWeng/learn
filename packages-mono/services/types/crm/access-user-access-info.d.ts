import type { BaseResponse } from '../common';

/**
 * @description 获取当前用户权限列表
 * @method POST
 * @url /api/v1/bdm/crm/api/access/user/info
 */
export declare namespace AccessUserAccessInfo {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
    access_code_list?: number[];
  };
}
