import type { BaseResponse, UserSetting } from '../common';

/**
 * @description 新建/更新个人设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/mul_upsert
 */
export declare namespace UserSettingMulUpsert {
  type Request = {
    setting_list?: UserSetting[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
