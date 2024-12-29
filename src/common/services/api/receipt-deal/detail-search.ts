import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import request from '@/common/request';
import { ReceiptDealDetailSearch } from '@fepkg/services/types/receipt-deal/detail-search';

/**
 * @description 根据筛选条件查询成交单明细
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/detail/search
 */
export const getReceiptDealDetail = (params: ReceiptDealDetailSearch.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealDetailSearch.Response, ReceiptDealDetailSearch.Request>(
    APIs.receiptDeal.dealDetailSearch,
    params,
    config
  );
};
