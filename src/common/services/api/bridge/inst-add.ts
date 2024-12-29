import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BridgeInstAdd } from '@fepkg/services/types/bridge/inst-add';
import request from '@/common/request';

/**
 * @description 添加桥机构
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bridge/inst/add
 */
export const addBridgeInst = (params: BridgeInstAdd.Request, config?: RequestConfig) => {
  return request.post<BridgeInstAdd.Response>(APIs.bridge.instAdd, params, config);
};
