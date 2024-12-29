import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealMulHandOver } from '@fepkg/services/types/receipt-deal/mul-hand-over';

/**
 * @description 成交单批量移交
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_hand_over
 */
export const dealMulHandover = (params: ReceiptDealMulHandOver.Request, config?: RequestConfig) => {
  return getRequest().post<ReceiptDealMulHandOver.Response>(APIs.receiptDeal.mulHandOver, params, config);
};
