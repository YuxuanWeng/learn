import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BridgeInstSearch } from '@fepkg/services/types/bridge/inst-search';
import request from '@/common/request';

/**
 * @description 模糊查询桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/search
 */
export const fuzzySearchBridgeInst = (params: BridgeInstSearch.Request, config?: RequestConfig) => {
  return request.post<BridgeInstSearch.Response>(APIs.bridge.instSearch, params, config);
};
