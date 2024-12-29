import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataMulCalculate } from '@fepkg/services/types/base-data/mul-calculate';
import request from '@/common/request';

/**
 * @description 计算器
 * @url /api/v1/bdm/bds/bds_api/base_data/mul_calculate
 */
export const mulCalculate = (params: BaseDataMulCalculate.Request, config?: RequestConfig) => {
  return request.post<BaseDataMulCalculate.Response>(APIs.baseData.mulCalculate, params, config);
};
