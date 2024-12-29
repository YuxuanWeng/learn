import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import request from '@/common/request';
import { ReceiptDealChangeBridge } from '@fepkg/services/types/receipt-deal/change-bridge';

/**
 * @description 换桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/change
 */
export const mulReceiptBridgeChange = (params: ReceiptDealChangeBridge.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealChangeBridge.Response>(APIs.receiptDeal.bridgeChange, params, {
    ...config,
    hideErrorMessage: true
  });
};
