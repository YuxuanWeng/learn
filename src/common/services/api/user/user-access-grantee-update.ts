import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserAccessGrantGranteeUpdate } from '@fepkg/services/types/user/access-grant-grantee-update';
import request from '@/common/request';

/**
 * @description 更新某个被授权人信息
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/grantee_update
 */
export const updateGrantee = (params: UserAccessGrantGranteeUpdate.Request, config?: RequestConfig) => {
  return request.post<UserAccessGrantGranteeUpdate.Response>(APIs.user.updateGrantee, params, config);
};
