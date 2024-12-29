import type { BaseResponse, WeekdayItem } from '../common';

/**
 * @description 批量获取某日后的前n个工作日，默认不包括当日
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/next_weekday_list/mul_get
 */
export declare namespace BaseDataNextWeekdayListMulGet {
  type Request = {
    date_list?: WeekdayItem[];
    count: number;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    next_weekday_list?: WeekdayList[];
    base_response?: BaseResponse;
  };

  export type WeekdayList = {
    weekdays?: string[];
  };
}
