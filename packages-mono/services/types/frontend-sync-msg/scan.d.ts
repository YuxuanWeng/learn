import type { BaseResponse, FrontendSyncMsg } from '../common';

/**
 * @description 拉取channel中缺失的消息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/frontend_sync_msg/scan
 */
export declare namespace FrontendSyncMsgScan {
  type Request = {
    channel: string;
    start_version: string;
    end_version: string;
  };

  type Response = {
    base_response?: BaseResponse;
    msg_list?: FrontendSyncMsg[];
  };
}
