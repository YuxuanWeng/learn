import type { BaseResponse } from '../common';

/**
 * @description 获取配置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/config/get
 */
export declare namespace ConfigGet {
  type Request = {
    namespace: string;
    key: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    value: string;
    base_response?: BaseResponse;
  };
}
