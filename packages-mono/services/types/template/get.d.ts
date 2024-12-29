import type { BaseResponse } from '../common';

/**
 * @description 获取模版(redis读取)
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/template/get
 */
export declare namespace TemplateGet {
  type Request = {
    key: string;
  };

  type Response = {
    base_response?: BaseResponse;
    value: string;
  };
}
