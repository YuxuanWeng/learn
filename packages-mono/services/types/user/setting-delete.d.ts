import type { BaseResponse } from '../common';
import { UserSettingFunction } from '../enum';

/**
 * @description 删除个人设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/delete
 */
export declare namespace UserSettingDelete {
  type Request = {
    function: UserSettingFunction;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
