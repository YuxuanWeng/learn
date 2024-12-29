import type { BaseResponse } from '../common';
import { BdsProductType } from '../enum';

/**
 * @description 重置broker 所有绑定的trader的配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/reset_broker_all_trader_config
 */
export declare namespace ResetBrokerAllTraderConfig {
  type Request = {
    product_type?: BdsProductType;
  };

  type Response = {
    base_response: BaseResponse;
  };
}
