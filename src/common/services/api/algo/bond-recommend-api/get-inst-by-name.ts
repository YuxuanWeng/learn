import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { GetInstByName } from '@fepkg/services/types/algo/get-inst-by-names';
import request from '@/common/request';

/**
 * @description 根据主体机构名称获取机构信息
 * @method POST
 * @url /api/v1/algo/bond_rec/recommend_api/get_inst_by_name
 */

export const getInstByName = (params: GetInstByName.Request, config?: RequestConfig) => {
  return request.post<GetInstByName.Response>(APIs.algo.getInstByName, params, {
    ...config,
    isAlgo: true
  });
};
