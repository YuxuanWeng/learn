import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealUpdateNeedBridge } from '@fepkg/services/types/receipt-deal/update-need-bridge';
import request from '@/common/request';

/**
 * @description 批量修改成交单待加桥状态
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/update_need_bridge
 */
export const mulUpdateNeedBridge = (params: ReceiptDealUpdateNeedBridge.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealUpdateNeedBridge.Response>(APIs.bridge.mulUpdateNeedBridge, params, config);
};
