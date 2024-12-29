import type { BaseResponse } from '../common';

/**
 * @description 获取某日后n天内的工作日列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/weekday_list/get
 */
export declare namespace BaseDataWeekdayListGet {
  type Request = {
    target_date: string;
    count: number;
    with_today?: boolean;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
    weekday_list?: string[];
  };
}
