import type { BaseResponse } from '../common';
import { RuleSwitchStatus } from '../enum';

/**
 * @description 更新地方债配置
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/bnc/update_trader_recommend_config
 */
export declare namespace BncUpdateTraderRecommendConfig {
  type Request = {
    broker_id: string;
    trader_id: string;
    h_enabled: RuleSwitchStatus;
    l_enabled: RuleSwitchStatus;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
