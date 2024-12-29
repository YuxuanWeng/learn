import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { SendRecommendBond } from '@fepkg/services/types/algo/send-recommend-bond';
import request from '@/common/request';

/**
 * @description 发送推荐债券
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/send_recommend_bond
 */
export const uploadBcoSendRecommendBondResult = (params: SendRecommendBond.Request, config?: RequestConfig) => {
  return request.post<SendRecommendBond.Response>(APIs.algo.bcoSendRecommendBond, params, {
    ...config,
    isAlgo: true
  });
};
