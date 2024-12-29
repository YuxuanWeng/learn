import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealPrint } from '@fepkg/services/types/receipt-deal/print';
import request from '@/common/request';

/**
 * @description 成交单打印，后端不做成交单数据更改，只是为了生成成交单日志
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/print
 */

export const printReceiptDeal = (params: ReceiptDealPrint.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealPrint.Response, ReceiptDealPrint.Request>(
    APIs.receiptDealApproval.print,
    params,
    config
  );
};
