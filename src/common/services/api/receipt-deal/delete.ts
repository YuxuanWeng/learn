import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealDelete } from '@fepkg/services/types/receipt-deal/delete';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

interface IDeleteReceiptDealUrgentById {
  receipt_deal_ids: string[];
  operation_source: OperationSource;
}

/**
 * @description 成交单删除
 * @url  /api/v1/bdm/bds/bds_api/receipt_deal/delete
 */
export const deleteReceiptDeal = (params: IDeleteReceiptDealUrgentById, config?: RequestConfig) => {
  const { receipt_deal_ids, operation_source } = params;
  return request.post<ReceiptDealDelete.Response, ReceiptDealDelete.Request>(
    APIs.receiptDeal.delete,
    {
      receipt_deal_ids,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTReceiptDealDelete,
        operation_source
      }
    },
    config
  );
};
