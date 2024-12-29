import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseConfigSet as BondRecBaseConfigSet } from '@fepkg/services/types/algo/set-base-config';
import request from '@/common/request';

/**
 * @description 信用债推券设置基本配置
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/set_base_config
 */
export const bondRecSetBaseConfig = (params: BondRecBaseConfigSet.Request, config?: RequestConfig) => {
  return request.post<BondRecBaseConfigSet.Response>(APIs.algo.bondRecSetBaseConfig, params, {
    ...config,
    isAlgo: true
  });
};
