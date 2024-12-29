import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealGroupCombinationUpdate } from '@fepkg/services/types/deal/group-combination-update';
import request from '@/common/request';

/**
 * @description 更改合并分组信息
 * @url /api/v1/bdm/bds/bds_api/deal/group_combination/update
 */
export const fetchGroupCombinationUpdate = (params: DealGroupCombinationUpdate.Request, config?: RequestConfig) => {
  return request.post<DealGroupCombinationUpdate.Response>(APIs.deal.groupCombinationUpdate, params, config);
};
