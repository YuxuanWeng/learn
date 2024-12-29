import type { BaseResponse, UserSetting } from '../common';
import { UserSettingFunction } from '../enum';

/**
 * @description 获取用户个人设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/get
 */
export declare namespace UserSettingGet {
  type Request = {
    function_list?: UserSettingFunction[];
  };

  type Response = {
    setting_list?: UserSetting[];
    base_response?: BaseResponse;
  };
}
