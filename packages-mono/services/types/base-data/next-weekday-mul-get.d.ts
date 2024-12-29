import type { BaseResponse, WeekdayItem } from '../common';

/**
 * @description 批量获取某日后的第一个工作日，默认不包括当日
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/next_weekday/mul_get
 */
export declare namespace BaseDataNextWeekdayMulGet {
  type Request = {
    date_list?: WeekdayItem[];
  };

  type Response = {
    status_code: number;
    status_msg: string;
    next_weekday_list?: string[];
    base_response?: BaseResponse;
  };
}
