import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealUpdateBridgeV2 } from '@fepkg/services/types/receipt-deal/update-bridge-v2';
import request from '@/common/request';

/**
 * @description 编辑桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/update_v2
 */
export const updateBridges = (params: ReceiptDealUpdateBridgeV2.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealUpdateBridgeV2.Response>(APIs.bridge.updateBridges, params, config);
};
