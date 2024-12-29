import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserList } from '@fepkg/services/types/user/list';

/**
 * @description 根据台子搜索所有用户列表
 * @url /api/v1/bdm/bds/bds_api/user/list
 */
export const fetchUserList = (params: UserList.Request, config?: RequestConfig) => {
  return getRequest().post<UserList.Response>(APIs.user.list, params, config);
};
