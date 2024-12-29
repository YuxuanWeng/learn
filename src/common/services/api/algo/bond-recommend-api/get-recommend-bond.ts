import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { GetRecommendBond } from '@fepkg/services/types/algo/get-recommend-bond';
import request from '@/common/request';

/**
 * @description 获取推荐债券
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/get_recommend_bond
 */
export const bcoGetRecommendBond = (params: GetRecommendBond.Request, config?: RequestConfig) => {
  return request.post<GetRecommendBond.Response>(APIs.algo.bcoGetRecommendBond, params, { ...config, isAlgo: true });
};
