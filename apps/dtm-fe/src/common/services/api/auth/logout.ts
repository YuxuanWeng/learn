import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { Logout } from '@fepkg/services/types/auth/logout';
import request from '@/common/request';

/**
 * @description 退出
 * @url /api/v1/bdm/base/auth_api/logout
 */
export const logout = (config?: RequestConfig) => {
  return request.post<Logout.Response>(APIs.auth.logout, {}, config);
};
