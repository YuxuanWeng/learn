import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ChatScriptGet } from '@fepkg/services/types/algo/quick-chat-api-chat-script-get';
import request from '@/common/request';

/**
 * @description 获取自动发话术配置
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/chat_script_get
 */
export const fetchChatScript = (params: ChatScriptGet.Request, config?: RequestConfig) => {
  return request.post<ChatScriptGet.Response>(APIs.algo.getChatScript, params, { ...config, isAlgo: true });
};
