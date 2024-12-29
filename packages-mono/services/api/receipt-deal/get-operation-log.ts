import { getRequest } from '@fepkg/request';
import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealGetOperationLog } from '@fepkg/services/types/receipt-deal/get-operation-log';

/**
 * @description 根据成交ID获取成交日志
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/get_operation_log
 */
export const fetchReceiptDealOperationLog = (params: ReceiptDealGetOperationLog.Request, config?: RequestConfig) => {
  return getRequest().post<ReceiptDealGetOperationLog.Response>(APIs.receiptDeal.getOperationLog, params, config);
};
