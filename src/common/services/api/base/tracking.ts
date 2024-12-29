import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BaseTracking } from '@fepkg/services/types/base/tracking';
import request from '@/common/request';

/**
 * @description 批量埋点上报
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/tracking
 */
export const serverTracking = (params: BaseTracking.Request, config?: RequestConfig) => {
  return request.post<BaseTracking.Response>(APIs.base.tracking, params, config);
};
