import type { BaseResponse } from '../common';

export type TrackingMessage = {
  event: string;
  event_time: number;
  from_event?: string;
  extra?: string; // json map
};

/**
 * @description 批量埋点上报
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/base/tracking
 */
export declare namespace BaseTracking {
  type Request = {
    message_list?: TrackingMessage[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
