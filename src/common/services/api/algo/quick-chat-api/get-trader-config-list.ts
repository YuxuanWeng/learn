import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { GetTraderConfigList } from '@fepkg/services/types/algo/quick-chat-api-get-trader-config-list';
import request from '@/common/request';

/**
 * @description 获取交易员配置列表
 * @method GET
 * @url /api/v1/algo/helper/quick_chat_api/get_trader_config_list
 */
export const fetchTraderConfigList = (params: GetTraderConfigList.Request, config?: RequestConfig) => {
  return request.get<GetTraderConfigList.Response>(APIs.algo.getTraderConfigList, params, { ...config, isAlgo: true });
};
