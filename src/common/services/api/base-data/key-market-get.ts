import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataBondGetByKeyMarket } from '@fepkg/services/types/base-data/bond-get-by-key-market';
import request from '@/common/request';

/**
 * @description 根据债券代码查询债券
 * @url /api/v1/bdm/bds/bds_api/base_data/bond/get_by_key_market
 */
export const fetchBondByKeyMarket = (params: BaseDataBondGetByKeyMarket.Request, config?: RequestConfig) => {
  return request.post<BaseDataBondGetByKeyMarket.Response>(APIs.baseData.keyMarketGet, params, config);
};
