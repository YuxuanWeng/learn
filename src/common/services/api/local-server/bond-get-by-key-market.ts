import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { LocalBondGetByKeyMarketList } from '@fepkg/services/types/data-localization-manual/bond/get-by-key-market-list';
import { LocalServerBondGetByKeyMarket } from '@fepkg/services/types/local-server/bond-get-by-key-market';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 根据债券唯一标识查询债券
 * @url /base_data/bond/get_by_key_market
 */
export const fetchLocalServerBondByKeyMarket = async (
  params: LocalServerBondGetByKeyMarket.Request,
  config?: RequestConfig
) => {
  if (!miscStorage.localServerAvailable) {
    return Promise.reject(new Error('localServer is not available'));
  }
  const res = await request.post<LocalServerBondGetByKeyMarket.Response>(APIs.baseData.keyMarketGet, params, {
    ...config,
    isLocalServerRequest: true,
    hideErrorMessage: true
  });

  // TODO: 前端本地化下线后数据结构改回LocalServerBondGetByKeyMarket.Response
  return {
    base_response: res.base_response,
    bond_list: res.bond_basic_list ?? []
  } as LocalBondGetByKeyMarketList.Response;
};
