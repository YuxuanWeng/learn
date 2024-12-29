import type { BaseResponse, BondRecommendConfig } from '../common';

/**
 * @description 更新模板配置规则
 * @method POST
 * @url /api/v1/algo/bond_recommend_api/update_config
 */
export declare namespace UpdateConfig {
  type Request = {
    config: BondRecommendConfig;
    broker_id?: string;
    trader_id: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    config?: BondRecommendConfig;
    base_response: BaseResponse;
  };
}
