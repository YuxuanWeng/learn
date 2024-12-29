import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserSettingMulUpsert } from '@fepkg/services/types/user/setting-mul-upsert';

/**
 * @description 新建/更新个人设置
 * @url /api/v1/bdm/bds/bds_api/user/setting/mul_upsert
 */
export const mulUpsertUserSetting = async (params: UserSettingMulUpsert.Request, config?: RequestConfig) => {
  return getRequest().post<UserSettingMulUpsert.Response>(APIs.user.settingMulUpsert, params, config);
};
