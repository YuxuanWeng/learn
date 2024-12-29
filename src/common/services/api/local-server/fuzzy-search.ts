import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { BaseDataSearch } from '@fepkg/services/types/base-data/search';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 根据用户输入模糊查询债券,机构,交易员,经纪人列表
 * @url /base_data/search
 */
export const fetchLocalServerFuzzySearch = (params: BaseDataSearch.Request, config?: RequestConfig) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  return request.post<BaseDataSearch.Response>(APIs.baseData.search, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });
};
