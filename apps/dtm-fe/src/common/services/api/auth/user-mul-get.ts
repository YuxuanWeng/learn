import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { AccessUserMulGet } from '@fepkg/services/types/crm/access-user-mul-get';
import { context } from '@opentelemetry/api';
import request from '@/common/request';

/**
 * @description 管理员批量获取用户权限列表
 * @url /api/v1/bdm/crm/api/access/user/mul_get
 */
export const fetchUsersAccess = (user_id_list?: string[], config?: RequestConfig) => {
  return request.post<AccessUserMulGet.Response, AccessUserMulGet.Request>(
    APIs.auth.getMulUserAccess,
    { user_id_list },
    { ...config, traceCtx: context.active() }
  );
};
