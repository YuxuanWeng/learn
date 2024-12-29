import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { UserPreferenceMulUpsert } from '@fepkg/services/types/user/preference-mul-upsert';
import request from '@/common/request';

/**
 * @description 批量更新用户首选项
 * @url /api/v1/bdm/bds/bds_api/user/preference/mul_upsert
 */
export const mulUpsertPreference = (params: UserPreferenceMulUpsert.Request, config?: RequestConfig) => {
  return request.post<UserPreferenceMulUpsert.Response>(APIs.user.preferenceMulUpsert, params, config);
};
