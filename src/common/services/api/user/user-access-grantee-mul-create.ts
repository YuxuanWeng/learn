import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UserAccessGrantGranteeMulCreate } from '@fepkg/services/types/user/access-grant-grantee-mul-create';
import request from '@/common/request';

/**
 * @description 批量创建被授权人
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/grantee_mul_create
 */
export const mulCreateGrantee = (params: UserAccessGrantGranteeMulCreate.Request, config?: RequestConfig) => {
  return request.post<UserAccessGrantGranteeMulCreate.Response>(APIs.user.mulCreateGrantee, params, config);
};
