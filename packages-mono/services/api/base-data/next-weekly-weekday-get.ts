import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataNextWeeklyWeekdayGet } from '@fepkg/services/types/base-data/next-weekly-weekday-get';

/**
 * @description 获取今日后的一周期间的第一个工作日
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/next_weekday/weekly/get
 */
export const fetchNextWeeklyWeekday = (config?: RequestConfig) => {
  return getRequest().post<BaseDataNextWeeklyWeekdayGet.Response>(APIs.baseData.nextWeeklyWeekdayGet, {}, config);
};
