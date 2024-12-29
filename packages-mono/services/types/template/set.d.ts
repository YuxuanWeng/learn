import type { BaseResponse } from '../common';

/**
 * @description 更新模版(redis写入)
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/template/set
 */
export declare namespace TemplateSet {
  type Request = {
    key: string;
    value: string;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
