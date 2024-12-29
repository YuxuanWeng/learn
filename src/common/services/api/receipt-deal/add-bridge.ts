import { message } from '@fepkg/components/Message';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealAddBridge } from '@fepkg/services/types/receipt-deal/add-bridge';
import request from '@/common/request';
import { isProd } from '@/common/utils';

/**
 * @description 加桥（单桥双桥用direction区分）
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/add
 */
export const mulReceiptBridgeAdd = (params: ReceiptDealAddBridge.Request, config?: RequestConfig) => {
  if (!isProd() && !params.bridge_inst_id) {
    message.error('bridgeInstId为空');
  }
  return request.post<ReceiptDealAddBridge.Response>(APIs.receiptDeal.bridgeAdd, params, {
    ...config,
    hideErrorMessage: true
  });
};
