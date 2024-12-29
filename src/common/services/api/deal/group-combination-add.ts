import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealGroupCombinationAdd } from '@fepkg/services/types/deal/group-combination-add';
import request from '@/common/request';

/**
 * @description 增加合并分组
 * @url /api/v1/bdm/bds/bds_api/deal/group_combination/add
 */
export const fetchGroupCombinationAdd = (params: DealGroupCombinationAdd.Request, config?: RequestConfig) => {
  return request.post<DealGroupCombinationAdd.Response>(APIs.deal.groupCombinationAdd, params, config);
};
