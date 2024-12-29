import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UpdateRecommendBond } from '@fepkg/services/types/algo/update-recommend-bond';
import request from '@/common/request';

/**
 * @description 更新推荐债券状态
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/update_recommend_bond
 */

export const bcoUpdateRecommendBond = (params: UpdateRecommendBond.Request, config?: RequestConfig) => {
  return request.post<UpdateRecommendBond.Response>(APIs.algo.bcoUpdateRecommendBond, params, {
    ...config,
    isAlgo: true
  });
};
