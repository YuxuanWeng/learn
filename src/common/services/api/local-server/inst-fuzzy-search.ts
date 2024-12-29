import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { InstFuzzySearch } from '@fepkg/services/types/inst/fuzzy-search';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 根据用户输入模糊查询机构列表
 * @url /inst/fuzzy_search
 */
export const fetchLocalServerInstSearch = (params: InstFuzzySearch.Request, config?: RequestConfig) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  return request.post<InstFuzzySearch.Response>(APIs.inst.fuzzySearch, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });
};
