import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ValConfigUpdate } from '@fepkg/services/types/algo/quick-chat-api-val-config-update';
import request from '@/common/request';

/**
 * @description 修改估值配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/val_config_update
 */
export const updateValConfig = (params: ValConfigUpdate.Request, config?: RequestConfig) => {
  return request.post<ValConfigUpdate.Response>(APIs.algo.updateValConfig, params, { ...config, isAlgo: true });
};
