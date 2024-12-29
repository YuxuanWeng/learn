import type { BaseResponse } from '../common';

/**
 * @description 获取当前 server 毫秒时间戳
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/current_timestamp
 */
export declare namespace CurrentTimestamp {
  type Request = {
    // None in here...
  };

  type Response = {
    base_response: BaseResponse;
    current_timestamp: string;
  };
}
