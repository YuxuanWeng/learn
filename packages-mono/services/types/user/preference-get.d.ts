import type { BaseResponse, UserPreference } from '../common';
import { UserPreferenceType } from '../enum';

/**
 * @description 获取用户首选项
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/preference/get
 */
export declare namespace UserPreferenceGet {
  type Request = {
    type_list?: UserPreferenceType[];
  };

  type Response = {
    base_response?: BaseResponse;
    preference_list?: UserPreference[];
  };
}
