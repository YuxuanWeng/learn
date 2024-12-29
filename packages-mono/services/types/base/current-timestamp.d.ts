import type { BaseResponse } from '../common';

/**
 * @description 获取当前 bds server 毫秒时间戳
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/current_timestamp
 */
export declare namespace BaseCurrentTimestamp {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
    current_timestamp: string;
  };
}
