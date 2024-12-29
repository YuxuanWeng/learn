import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { CardsOperation } from '@fepkg/services/types/algo/quick-chat-api-cards-operation';
import request from '@/common/request';

/**
 * @description 快聊卡片点击删除/提交
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/cards_operation
 */
export const doCardOperation = (params: CardsOperation.Request, config?: RequestConfig) => {
  return request.post<CardsOperation.Response>(APIs.algo.doCardsOperation, params, { ...config, isAlgo: true });
};
