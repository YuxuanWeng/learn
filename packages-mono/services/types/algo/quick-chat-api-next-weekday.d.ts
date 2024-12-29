import type { BaseResponse } from '../common';
import { ListedMarket } from '../enum';

/**
 * @description 获取某日后的第一个工作日，默认不包括当天
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/next_weekday
 */
export declare namespace NextWeekday {
  type Request = {
    target_date: string;
    listed_market?: ListedMarket;
    with_today?: boolean;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    next_weekday: string;
    base_response?: BaseResponse;
  };
}
