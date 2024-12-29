import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ChatScriptUpdate } from '@fepkg/services/types/algo/quick-chat-api-chat-script-update';
import request from '@/common/request';

/**
 * @description 更新自动发话术配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/chat_script_update
 */
export const updateChatScript = (params: ChatScriptUpdate.Request, config?: RequestConfig) => {
  return request.post<ChatScriptUpdate.Response>(APIs.algo.updateChatScript, params, { ...config, isAlgo: true });
};
