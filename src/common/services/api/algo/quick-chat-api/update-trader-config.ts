import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UpdateTraderConfig } from '@fepkg/services/types/algo/quick-chat-api-update-trader-config';
import request from '@/common/request';

/**
 * @description 修改交易员配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/update_trader_config
 */
export const updateTraderConfig = (params: UpdateTraderConfig.Request, config?: RequestConfig) => {
  return request.post<UpdateTraderConfig.Response>(APIs.algo.updateTraderConfig, params, { ...config, isAlgo: true });
};
