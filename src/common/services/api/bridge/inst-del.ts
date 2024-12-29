import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BridgeInstDel } from '@fepkg/services/types/bridge/inst-del';
import request from '@/common/request';

/**
 * @description 删除桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/del
 */

export const delBridgeInst = (params: BridgeInstDel.Request, config?: RequestConfig) => {
  return request.post<BridgeInstDel.Response>(APIs.bridge.instDel, params, config);
};
