import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/bds-enum';
import { ReceiptDealUpdateSendOrderInfo } from '@fepkg/services/types/receipt-deal/update-send-order-info';
import request from '@/common/request';

/**
 * @description 修改成交单发单信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/update_send_order_info
 */
export const updateSendOrderInfo = (params: ReceiptDealUpdateSendOrderInfo.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealUpdateSendOrderInfo.Response>(
    APIs.receiptDeal.updateSendOrderInfo,
    {
      ...params,
      operation_info: {
        operation_type: DealOperationType.DOTModifyDeal,
        operation_source: OperationSource.OperationSourceReceiptDealDetail
      }
    },
    config
  );
};
