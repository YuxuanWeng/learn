import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealMulConfirm } from '@fepkg/services/types/receipt-deal/mul-confirm';
import request from '@/common/request';

/**
 * @description 成交单批量确认
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_confirm
 */
export const mulConfirmReceiptDeal = (params: ReceiptDealMulConfirm.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealMulConfirm.Response>(APIs.receiptDeal.mulConfirm, params, config);
};
