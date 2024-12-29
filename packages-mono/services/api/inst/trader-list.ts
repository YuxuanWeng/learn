import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { InstTraderList } from '@fepkg/services/types/inst/trader-list';

/**
 * @description 查询机构下属于某台子的交易员列表
 * @url /api/v1/bdm/bds/bds_api/inst/trader/list
 */
export const fetchInstTraderList = (params: InstTraderList.Request, config?: RequestConfig) => {
  return getRequest().post<InstTraderList.Response>(APIs.inst.traderList, params, config);
};
