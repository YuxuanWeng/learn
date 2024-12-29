import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealUnreferQuote } from '@fepkg/services/types/receipt-deal/unrefer-quote';

/**
 * @description 成交单列表反挂
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/quote/unrefer
 */
export const receiptDealUnreferQuote = (params: ReceiptDealUnreferQuote.Request, config?: RequestConfig) => {
  return getRequest().post<ReceiptDealUnreferQuote.Response>(APIs.receiptDeal.quoteUnrefer, params, config);
};
