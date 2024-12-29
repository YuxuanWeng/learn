import type { BaseResponse } from '../common';

export type FileStat = {
  filename: string;
  last_modified: string;
};

/**
 * @description local server心跳接口，同时查询bond文件的现状
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/local_server/heartbeat
 */
export declare namespace LocalServerHeartbeat {
  type Request = {
    filename_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    file_info_list?: FileStat[];
  };
}
