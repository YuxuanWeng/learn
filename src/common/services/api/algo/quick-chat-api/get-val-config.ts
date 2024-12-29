import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ValConfigGet } from '@fepkg/services/types/algo/quick-chat-api-val-config-get';
import request from '@/common/request';

/**
 * @description 获取估值配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/val_config_get
 */
export const fetchValConfig = (params: ValConfigGet.Request, config?: RequestConfig) => {
  return request.post<ValConfigGet.Response>(APIs.algo.getValConfig, params, { ...config, isAlgo: true });
};
