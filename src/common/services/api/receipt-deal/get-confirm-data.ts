import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealGetConfirmData } from '@fepkg/services/types/receipt-deal/get-confirm-data';
import request from '@/common/request';

/**
 * @description 查询当前用户对于成交单的上次确认数据
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/get_confirm_data
 */
export const getReceiptDealConfirmData = (params: ReceiptDealGetConfirmData.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealGetConfirmData.Response, ReceiptDealGetConfirmData.Request>(
    APIs.receiptDeal.getReceiptDealConfirmData,
    params,
    config
  );
};
