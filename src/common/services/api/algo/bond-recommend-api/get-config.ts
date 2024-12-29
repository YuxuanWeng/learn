import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { GetConfig as BondRecommendAPIGetConfig } from '@fepkg/services/types/algo/get-config';
import request from '@/common/request';

/**
 * @description 获取模板配置规则
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/get_config
 */

export const bcoBondRecommendGetConfig = (params: BondRecommendAPIGetConfig.Request, config?: RequestConfig) => {
  return request.post<BondRecommendAPIGetConfig.Response>(APIs.algo.bcoBondRecommendGetConfig, params, {
    ...config,
    isAlgo: true
  });
};
