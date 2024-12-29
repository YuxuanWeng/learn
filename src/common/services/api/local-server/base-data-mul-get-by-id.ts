import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { LocalServerBaseDataMulGetById } from '@fepkg/services/types/local-server/base-data-mul-get-by-id';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 根据id查询债券,机构,交易员,经纪人列表
 * @url /base_data/mul_get_by_id
 */
export const fetchLocalServerMulGetById = (params: LocalServerBaseDataMulGetById.Request, config?: RequestConfig) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  return request.post<LocalServerBaseDataMulGetById.Response>(APIs.baseData.mulGetById, params, {
    ...config,
    isLocalServerRequest: true
  });
};
