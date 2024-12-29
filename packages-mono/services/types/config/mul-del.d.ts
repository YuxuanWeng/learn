import type { BaseResponse } from '../common';

/**
 * @description 删除配置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/config/mul_del
 */
export declare namespace ConfigMulDel {
  type Request = {
    namespace: string;
    keys?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
