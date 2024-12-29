import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { FilterGroupDelete } from '@fepkg/services/types/filter-group/delete';
import request from '@/common/request';

/**
 * @description 删除筛选分组
 * @url /api/v1/bdm/bds/bds_api/filter_group/delete
 */
export const deleteFilterGroup = (params: FilterGroupDelete.Request, config?: RequestConfig) => {
  return request.post<FilterGroupDelete.Response>(APIs.filterGroup.delete, params, config);
};
