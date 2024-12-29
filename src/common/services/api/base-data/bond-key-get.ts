import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondMget } from '@fepkg/services/types/base-data/bond-mget';
import request from '@/common/request';

/**
 * @description 根据债券唯一标识查询流通市场
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/mget
 */
export const fetchBondKey = (params: BaseDataBondMget.Request, config?: RequestConfig) => {
  return request.post<BaseDataBondMget.Response>(APIs.baseData.bondMget, params, config);
};
