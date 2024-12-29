import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { ReceiptDealDetailSearchByBridgeInst } from '@fepkg/services/types/receipt-deal/detail-search-by-bridge-inst';
import request from '@/common/request';

/**
 * @description 根据桥机构筛选条件查询成交单明细
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/detail/search_by_bridge_inst
 */
export const fetchReceiptDealDetailSearchByBridgeInst = (
  params: ReceiptDealDetailSearchByBridgeInst.Request,
  config?: RequestConfig
) => {
  return request.post<ReceiptDealDetailSearchByBridgeInst.Response>(
    APIs.receiptDeal.dealDetailSearchByInst,
    params,
    config
  );
};
