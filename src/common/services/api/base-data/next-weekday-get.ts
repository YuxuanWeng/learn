import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataNextWeekdayGet } from '@fepkg/services/types/base-data/next-weekday-get';
import request from '@/common/request';

/**
 * @description 获取某日后的第一个工作日
 * @url /api/v1/bdm/bds/bds_api/base_data/next_weekday/get
 */
export const fetchNextWeekday = (params: BaseDataNextWeekdayGet.Request, config?: RequestConfig) => {
  return request.post<BaseDataNextWeekdayGet.Response>(APIs.baseData.nextWeekdayGet, params, config);
};
