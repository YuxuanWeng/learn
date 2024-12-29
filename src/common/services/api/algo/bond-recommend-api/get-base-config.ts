import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BaseConfigGet as BondRecBaseConfigGet } from '@fepkg/services/types/algo/get-base-config';
import request from '@/common/request';

/**
 * @description 信用债推券获取基本配置
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/get_base_config
 */
export const bondRecGetBaseConfig = (params: BondRecBaseConfigGet.Request, config?: RequestConfig) => {
  return request.post<BondRecBaseConfigGet.Response>(APIs.algo.bondRecGetBaseConfig, params, {
    ...config,
    isAlgo: true
  });
};
