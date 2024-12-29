import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { LocalTraderGetByIdList } from '@fepkg/services/types/data-localization-manual/trader/get-by-id-list';
import { LocalServerTraderGetById } from '@fepkg/services/types/local-server/trader-get-by-id';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 根据交易员id查询交易员
 * @url /trader/get_by_id
 */
export const fetchLocalServerTraderByIdList = async (
  params: LocalServerTraderGetById.Request,
  config?: RequestConfig
) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  const res = await request.post<LocalServerTraderGetById.Response>(APIs.trader.getById, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });

  // TODO: 前端本地化下线后数据结构改回LocalTraderGetByIdList.Response
  return {
    base_response: res.base_response,
    trader_sync_list: res.trader_list ?? []
  } as LocalTraderGetByIdList.Response;
};
