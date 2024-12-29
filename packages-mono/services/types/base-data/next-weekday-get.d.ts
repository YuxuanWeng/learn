import type { BaseResponse } from '../common';
import { ListedMarket } from '../enum';

/**
 * @description 获取某日后的第一个工作日，默认不包括当天
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base_data/next_weekday/get
 */
export declare namespace BaseDataNextWeekdayGet {
  type Request = {
    target_date: string;
    listed_market?: ListedMarket;
    with_today?: boolean;
  };

  type Response = {
    next_weekday: string;
    base_response?: BaseResponse;
  };
}
