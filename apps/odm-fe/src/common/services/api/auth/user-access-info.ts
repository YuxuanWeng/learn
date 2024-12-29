import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { AccessUserAccessInfo } from '@fepkg/services/types/crm/access-user-access-info';
import { context } from '@opentelemetry/api';
import request from '@/common/request';

/**
 * @description 获取当前用户权限列表
 * @url /api/v1/bdm/crm/api/access/user/info
 */
export const fetchUserAccessInfo = (config?: RequestConfig) => {
  return request.post<AccessUserAccessInfo.Response>(
    APIs.auth.getUserAccess,
    {},
    { ...config, traceCtx: context.active() }
  );
};
