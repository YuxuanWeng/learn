import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserSettingGet } from '@fepkg/services/types/user/setting-get';

/**
 * @description 获取用户个人设置
 * @url /api/v1/bdm/bds/bds_api/user/setting/get
 */
export const fetchUserSetting = (params: UserSettingGet.Request, config?: RequestConfig) => {
  return getRequest().post<UserSettingGet.Response>(APIs.user.settingGet, params, config);
};
