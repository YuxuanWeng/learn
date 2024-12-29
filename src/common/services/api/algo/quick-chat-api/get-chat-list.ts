import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ChatListGet } from '@fepkg/services/types/algo/quick-chat-api-chat-list-get';
import request from '@/common/request';

/**
 * @description 快聊获取聊天列表
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/chat_list_get
 */
export const fetchChatList = (params: ChatListGet.Request, config?: RequestConfig) => {
  return request.post<ChatListGet.Response>(APIs.algo.getChatList, params, { ...config, isAlgo: true });
};
