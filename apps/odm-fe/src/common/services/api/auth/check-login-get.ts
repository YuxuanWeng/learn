import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { CheckLogin } from '@fepkg/services/types/auth/check-login';
import request from '@/common/request';

/**
 * @description 检查登录状态
 * @url /api/v1/bdm/base/auth_api/check_login
 */
export const checkLogin = (config?: RequestConfig) => {
  return request.post<CheckLogin.Response>(APIs.auth.checkLogin, {}, { ...config });
};