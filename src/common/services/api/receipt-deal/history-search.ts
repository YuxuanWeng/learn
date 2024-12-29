import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealSearchRealParentDeal } from '@fepkg/services/types/receipt-deal/search-real-parent-deal';
import request from '@/common/request';

/**
 * @description 历史成交单查询
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/real_parent_deal/search
 */
export const historyDealSearch = (params: ReceiptDealSearchRealParentDeal.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealSearchRealParentDeal.Response>(APIs.receiptDeal.historyDealSearch, params, config);
};
