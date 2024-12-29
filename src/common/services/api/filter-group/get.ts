import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { FilterGroupGet } from '@fepkg/services/types/filter-group/get';
import request from '@/common/request';

/**
 * @description 根据 broker_id 获取筛选分组
 * @url /api/v1/bdm/bds/bds_api/filter_group/get
 */
export const fetchFilterGroup = (params: FilterGroupGet.Request, config?: RequestConfig) => {
  return request.post<FilterGroupGet.Response>(APIs.filterGroup.get, params, config);
};
