import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { LocalServerBaseDataBondSearch } from '@fepkg/services/types/local-server/base-data-bond-search';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 债券搜索
 * @url /base_data/bond/search
 */
export const fetchLocalServerBondSearch = (params: LocalServerBaseDataBondSearch.Request, config?: RequestConfig) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  return request.post<LocalServerBaseDataBondSearch.Response>(APIs.baseData.bondSearch, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });
};
