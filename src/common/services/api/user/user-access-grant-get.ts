import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserAccessGrantGet } from '@fepkg/services/types/user/access-grant-get';
import request from '@/common/request';

/**
 * @description 获取用户授权列表
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/get
 */
export const getUserAccessGrant = (params: UserAccessGrantGet.Request, config?: RequestConfig) => {
  return request.post<UserAccessGrantGet.Response>(APIs.user.getUserAccessGrant, params, config);
};
