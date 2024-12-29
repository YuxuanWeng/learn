import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { CardsInfoGet } from '@fepkg/services/types/algo/quick-chat-api-cards-info-get';
import request from '@/common/request';

/**
 * @description 获取快聊卡片信息
 * @method POST
 * @url /api/v1/algo/helper/quick_chat_api/cards_info_get
 */
export const fetchCardsInfo = (params: CardsInfoGet.Request, config?: RequestConfig) => {
  return request.post<CardsInfoGet.Response>(APIs.algo.getCardsInfo, params, { ...config, isAlgo: true });
};
