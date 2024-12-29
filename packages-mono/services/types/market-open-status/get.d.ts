import type { BaseResponse } from '../common';
import { MarketOpenStatus } from '../enum';

/**
 * @description 获取开闭市状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_open_status/get
 */
export declare namespace MarketOpenStatusGet {
  type Request = {
    // None in here...
  };

  type Response = {
    status_code: number;
    status_msg: string;
    open_status: MarketOpenStatus;
    base_response?: BaseResponse;
  };
}
