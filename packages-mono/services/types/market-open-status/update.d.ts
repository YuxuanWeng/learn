import type { BaseResponse } from '../common';
import { MarketOpenStatus } from '../enum';

/**
 * @description 更新开闭市状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/market_open_status/update
 */
export declare namespace MarketOpenStatusUpdate {
  type Request = {
    open_status: MarketOpenStatus;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
