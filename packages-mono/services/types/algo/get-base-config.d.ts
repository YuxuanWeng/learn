import type { BaseResponse } from '../common';

/**
 * @description 获取配置
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/get_base_config
 */
export declare namespace BaseConfigGet {
  type Request = {
    type: number; // 信用债使用场景配置不同;1-推荐次数;2-默认话术
    broker_qm_id: string;
    trader_idb_key?: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    value: string;
    base_response?: BaseResponse;
  };
}
