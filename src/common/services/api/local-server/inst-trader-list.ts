import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { InstTraderList } from '@fepkg/services/types/inst/trader-list';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 查询机构下属于某台子的交易员列表
 * @url /inst/trader/list
 */
export const fetchLocalServerInstTraderList = (params: InstTraderList.Request, config?: RequestConfig) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }

  return request.post<InstTraderList.Response>(APIs.inst.traderList, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });
};
