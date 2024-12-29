import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { FilterGroupUpdate } from '@fepkg/services/types/filter-group/update';
import request from '@/common/request';

/**
 * @description 更新筛选分组
 * @url /api/v1/bdm/bds/bds_api/filter_group/update
 */
export const updateFilterGroup = (params: FilterGroupUpdate.Request, config?: RequestConfig) => {
  return request.post<FilterGroupUpdate.Response>(APIs.filterGroup.update, params, config);
};
