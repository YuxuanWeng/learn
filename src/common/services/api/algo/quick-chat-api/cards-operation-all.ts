import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { CardsAllOperation } from '@fepkg/services/types/algo/quick-chat-api-cards-all-operation';
import request from '@/common/request';

/**
 * @description 快聊卡片点击全部删除/提交
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/cards_all_operation
 */
export const doCardOperationAll = (params: CardsAllOperation.Request, config?: RequestConfig) => {
  return request.post<CardsAllOperation.Response>(APIs.algo.doCardsOperationAll, params, { ...config, isAlgo: true });
};
