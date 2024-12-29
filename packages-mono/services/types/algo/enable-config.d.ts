import type { BaseResponse } from '../common';

/**
 * @description 模板配置生效/失效
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/enable_config
 */
export declare namespace EnableConfig {
  type Request = {
    broker_id?: string;
    trader_id_list?: string[];
    h_enabled: boolean;
    f_enabled: boolean;
    im_enabled: boolean;
    qm_enabled: boolean;
    issuer_enabled: boolean;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response: BaseResponse;
  };
}
