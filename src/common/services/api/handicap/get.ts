import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { HandicapGetByBond } from '@fepkg/services/types/handicap/get-by-bond';
import request from '@/common/request';

/**
 * @description 债券代码批量获取报价&成交盘口信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/handicap/get_by_bond
 */
export const batchFetchHandicapGetByBond = (param: HandicapGetByBond.Request, config?: RequestConfig) => {
  return request.post<HandicapGetByBond.Response>(APIs.handicap.getByBond, param, config);
};
