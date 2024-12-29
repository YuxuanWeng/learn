import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealGetByParent } from '@fepkg/services/types/receipt-deal/get-by-parent';
import request from '@/common/request';

/**
 * @description 成交单查询（通过源成交单，可查询桥相关成交单）
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/get_by_parent
 */
export const fetchReceiptDealByParent = (params: ReceiptDealGetByParent.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealGetByParent.Response>(APIs.receiptDeal.getByParent, params, config);
};
