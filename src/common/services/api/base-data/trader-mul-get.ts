import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataTraderMulGet } from '@fepkg/services/types/base-data/trader-mul-get';
import request from '@/common/request';

/**
 * @description 获取批量获取 trader
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/trader/mul_get
 */
export const traderMulGet = (params: BaseDataTraderMulGet.Request, config?: RequestConfig) => {
  return request.post<BaseDataTraderMulGet.Response>(APIs.baseData.traderMulGet, params, config);
};
