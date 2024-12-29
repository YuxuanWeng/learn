import type { BaseResponse } from '../common';
import { IssuerDateType } from '../enum';

/**
 * @description 获取今日后的一周期间的第一个工作日
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/next_weekday/weekly/get
 */
export declare namespace BaseDataNextWeeklyWeekdayGet {
  type Request = {
    // None in here...
  };

  type Response = {
    weekly_weekday?: WeeklyWeekday[];
    base_response?: BaseResponse;
  };

  export type WeeklyWeekday = {
    weekday_type: IssuerDateType;
    next_weekday: string;
  };
}
