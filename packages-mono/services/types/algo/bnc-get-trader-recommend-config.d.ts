import type { BaseResponse } from '../common';
import { RuleSwitchStatus } from '../enum';

/**
 * @description 获取利率债开关配置
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/get_trader_recommend_config
 */
export declare namespace BncGetTraderRecommendConfig {
  type Request = {
    broker_id: string;
  };

  type Response = {
    base_response: BaseResponse;
    config_list?: BncTraderRecommendConfig[];
  };

  export type BncTraderRecommendConfig = {
    trader_id: string;
    trader_name: string;
    inst_name: string;
    h_enabled: RuleSwitchStatus;
    l_enabled: RuleSwitchStatus;
  };
}
