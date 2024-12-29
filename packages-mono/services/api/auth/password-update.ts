import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { PasswordUpdate } from '@fepkg/services/types/auth/password-update';

/**
 * @description 更新密码
 * @url /api/v1/bdm/base/auth_api/password/update
 */
export const updateUserPassword = (params: PasswordUpdate.Request, config?: RequestConfig) => {
  return getRequest().post(APIs.auth.updatePassword, params, config);
};
