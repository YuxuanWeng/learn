import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseDataWeekdayListGet } from '@fepkg/services/types/base-data/weekday-list-get';

/**
 * @description 获取某日后n天内的工作日列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/weekday_list/get
 */
export const fetchWeekdayList = (params: BaseDataWeekdayListGet.Request, config?: RequestConfig) => {
  return getRequest().post<BaseDataWeekdayListGet.Response>(APIs.baseData.weekdayListGet, params, config);
};
