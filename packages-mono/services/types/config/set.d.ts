import type { BaseResponse } from '../common';

/**
 * @description 设置配置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/config/set
 */
export declare namespace ConfigSet {
  type Request = {
    namespace: string;
    key: string;
    value: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
