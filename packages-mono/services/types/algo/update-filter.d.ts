import type { BaseResponse } from '../common';

/**
 * @description 更新筛选配置
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/update_filter_setting
 */
export declare namespace UpdateFilterSetting {
  type Request = {
    pass_rule_group?: string[]; // 通过的规则组，H/I/S/L
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response: BaseResponse;
  };
}
