import type { BaseResponse, UserPreference } from '../common';

/**
 * @description 新建/更新个人首选项
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/preference/mul_upsert
 */
export declare namespace UserPreferenceMulUpsert {
  type Request = {
    preference_list?: UserPreference[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
