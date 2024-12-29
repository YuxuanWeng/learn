import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DeleteConfig } from '@fepkg/services/types/algo/delete-config';
import request from '@/common/request';

/**
 * @description 删除模板配置规则
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/delete_config
 */

export const bcoBondRecommendDeleteConfig = (params: DeleteConfig.Request, config?: RequestConfig) => {
  return request.post<DeleteConfig.Response>(APIs.algo.bcoBondRecommendDeleteConfig, params, {
    ...config,
    isAlgo: true
  });
};
