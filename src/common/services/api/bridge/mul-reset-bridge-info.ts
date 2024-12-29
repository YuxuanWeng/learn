import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealMulResetBridgeInfo } from '@fepkg/services/types/receipt-deal/mul-reset-bridge-info';
import request from '@/common/request';

/**
 * @description 批量重置桥信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_reset_bridge_info
 */
export const mulResetBridgeInfo = (params: ReceiptDealMulResetBridgeInfo.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealMulResetBridgeInfo.Response>(APIs.bridge.mulResetBridgeInfo, params, config);
};
