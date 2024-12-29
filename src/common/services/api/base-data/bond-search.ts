import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondSearch } from '@fepkg/services/types/base-data/bond-search';
import request from '@/common/request';

/**
 * @description 债券筛选查询
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/search
 */
export const fetchBondSearch = (params: BaseDataBondSearch.Request, config?: RequestConfig) => {
  return request.post<BaseDataBondSearch.Response>(APIs.baseData.bondSearch, params, config);
};
