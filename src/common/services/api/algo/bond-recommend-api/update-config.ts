import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { UpdateConfig } from '@fepkg/services/types/algo/update-config';
import request from '@/common/request';

/**
 * @description 更新模板配置规则
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/update_config
 */

export const bcoBondRecommendUpdateConfig = (params: UpdateConfig.Request, config?: RequestConfig) => {
  return request.post<UpdateConfig.Response>(APIs.algo.bcoBondRecommendUpdateConfig, params, {
    ...config,
    isAlgo: true
  });
};
