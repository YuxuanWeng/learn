import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { HistoryMsgList } from '@fepkg/services/types/algo/quick-chat-api-history-msg-list';
import request from '@/common/request';

/**
 * @description 拉取历史消息
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/history_msg_list
 */
export const getHistoryMsgList = (params: HistoryMsgList.Request, config?: RequestConfig) => {
  return request.post<HistoryMsgList.Response>(APIs.algo.getHistoryMsgList, params, { ...config, isAlgo: true });
};
