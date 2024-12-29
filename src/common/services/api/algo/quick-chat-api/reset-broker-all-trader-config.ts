import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ResetBrokerAllTraderConfig } from '@fepkg/services/types/algo/quick-chat-api-reset-broker-all-trader-config';
import request from '@/common/request';

/**
 * @description 重置broker 所有绑定的trader的配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/reset_broker_all_trader_config
 */
export const resetTraderConfig = (params: ResetBrokerAllTraderConfig.Request, config?: RequestConfig) => {
  return request.post<ResetBrokerAllTraderConfig.Response>(APIs.algo.resetTraderConfig, params, {
    ...config,
    isAlgo: true
  });
};
