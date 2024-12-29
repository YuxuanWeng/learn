import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataNextWeekdayMulGet } from '@fepkg/services/types/base-data/next-weekday-mul-get';
import request from '@/common/request';

/**
 * @description 批量获取某日后的第一个工作日，默认不包括当日
 * @url /api/v1/bdm/bds/bds_api/base_data/next_weekday/mul_get
 */
export const mulFetchNextWeekday = (params: BaseDataNextWeekdayMulGet.Request, config?: RequestConfig) => {
  return request.post<BaseDataNextWeekdayMulGet.Response>(APIs.baseData.nextWeekdayMulGet, params, config);
};
