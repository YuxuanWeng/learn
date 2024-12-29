import type { BaseResponse } from '../common';

/**
 * @description 删除模板配置规则
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/delete_config
 */
export declare namespace DeleteConfig {
  type Request = {
    config_id: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response: BaseResponse;
  };
}
