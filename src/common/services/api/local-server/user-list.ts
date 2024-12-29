import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { UserList } from '@fepkg/services/types/user/list';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 根据用户输入模糊搜索交易员列表
 * @url /trader/search
 */
export const fetchLocalServerUserList = async (params: UserList.Request, config?: RequestConfig) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  return request.post<UserList.Response>(APIs.user.list, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });
};
