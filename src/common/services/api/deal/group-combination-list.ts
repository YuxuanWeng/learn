import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealGroupCombinationList } from '@fepkg/services/types/deal/group-combination-list';
import request from '@/common/request';

/**
 * @description 合并分组列表
 * @url /api/v1/bdm/bds/bds_api/deal/group_combination/list
 */
export const fetchGroupCombinationList = (params: DealGroupCombinationList.Request, config?: RequestConfig) => {
  return request.post<DealGroupCombinationList.Response>(APIs.deal.groupCombinationList, params, config);
};
