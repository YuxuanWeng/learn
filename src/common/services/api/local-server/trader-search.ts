import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { LocalServerTraderSearch } from '@fepkg/services/types/local-server/trader-search';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 根据用户输入模糊搜索交易员列表
 * @url /trader/search
 */
export const fetchLocalServerTraderSearch = async (params: LocalServerTraderSearch.Request, config?: RequestConfig) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  return request.post<LocalServerTraderSearch.Response>(APIs.trader.search, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });
};
