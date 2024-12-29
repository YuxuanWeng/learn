import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BridgeInstUpdate } from '@fepkg/services/types/bridge/inst-update';
import request from '@/common/request';

/**
 * @description 修改桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/update
 */
export const updateBridgeInst = (params: BridgeInstUpdate.Request, config?: RequestConfig) => {
  return request.post<BridgeInstUpdate.Response>(APIs.bridge.instUpdate, params, config);
};
