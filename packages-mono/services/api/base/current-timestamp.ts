import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseCurrentTimestamp } from '@fepkg/services/types/base/current-timestamp';

/**
 * @description 获取当前 bds server 毫秒时间戳
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/current_timestamp
 */
export const fetchCurrentTimestamp = (config?: RequestConfig) => {
  return getRequest().post<BaseCurrentTimestamp.Response>(APIs.base.currentTimestamp, {}, config);
};
