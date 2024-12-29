import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserAccessGrantGranteeMulDelete } from '@fepkg/services/types/user/access-grant-grantee-mul-delete';
import request from '@/common/request';

/**
 * @description 批量删除被授权人
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/grantee_mul_delete
 */
export const mulDeleteGrantee = (params: UserAccessGrantGranteeMulDelete.Request, config?: RequestConfig) => {
  return request.post<UserAccessGrantGranteeMulDelete.Response>(APIs.user.mulDeleteGrantee, params, config);
};
