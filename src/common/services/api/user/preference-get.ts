import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { UserPreferenceGet } from '@fepkg/services/types/user/preference-get';
import request from '@/common/request';

/**
 * @description 获取用户首选项
 * @url /api/v1/bdm/bds/bds_api/user/preference/get
 */
export const fetchPreference = (params: UserPreferenceGet.Request, config?: RequestConfig) => {
  return request.post<UserPreferenceGet.Response>(APIs.user.preferenceGet, params, config);
};
