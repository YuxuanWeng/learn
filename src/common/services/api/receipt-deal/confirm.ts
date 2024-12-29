import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealConfirm } from '@fepkg/services/types/receipt-deal/confirm';
import request from '@/common/request';

/**
 * @description 成交单确认
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/confirm
 */
export const confirmReceiptDeal = (params: ReceiptDealConfirm.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealConfirm.Response>(APIs.receiptDeal.confirm, params, config);
};
