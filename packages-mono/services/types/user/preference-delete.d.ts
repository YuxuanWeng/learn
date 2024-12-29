import type { BaseResponse } from '../common';
import { UserPreferenceType } from '../enum';

/**
 * @description 删除个人首选项
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/preference/delete
 */
export declare namespace UserPreferenceDelete {
  type Request = {
    type_list?: UserPreferenceType[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
