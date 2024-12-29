import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserGetInfo } from '@fepkg/services/types/user/get-info';

/**
 * @description 查看个人信息
 * @url /api/v1/bdm/bds/bds_api/user/info/get
 */
export const fetchUserInfo = (params: UserGetInfo.Request, config?: RequestConfig) => {
  return getRequest().post<UserGetInfo.Response>(APIs.user.getInfo, params, config);
};
