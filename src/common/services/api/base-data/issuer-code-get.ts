import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondFilter } from '@fepkg/services/types/base-data/bond-filter';
import request from '@/common/request';

/**
 * @description 根据发行商代码查询债券
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/filter
 */
export const fetchBondByIssuerCode = (params: BaseDataBondFilter.Request, config?: RequestConfig) => {
  return request.post<BaseDataBondFilter.Response>(APIs.baseData.issuerCodeGet, params, config);
};
