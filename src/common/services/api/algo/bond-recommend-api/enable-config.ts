import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { EnableConfig as BondRecommendAPIEnableConfig } from '@fepkg/services/types/algo/enable-config';
import request from '@/common/request';

/**
 * @description 模板配置生效/失效
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/enable_config
 */

export const bcoBondRecommendEnableConfig = (params: BondRecommendAPIEnableConfig.Request, config?: RequestConfig) => {
  return request.post<BondRecommendAPIEnableConfig.Response>(APIs.algo.bcoBondRecommendEnableConfig, params, {
    ...config,
    isAlgo: true
  });
};
