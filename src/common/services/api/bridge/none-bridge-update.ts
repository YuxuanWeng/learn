import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealUpdateNonBridge } from '@fepkg/services/types/receipt-deal/update-non-bridge';
import request from '@/common/request';

/**
 * @description 无桥成交单编辑
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/non_bridge/update
 */
export const updateNoneBridge = (params: ReceiptDealUpdateNonBridge.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealUpdateNonBridge.Response>(APIs.bridge.updateNoneBridge, params, config);
};
