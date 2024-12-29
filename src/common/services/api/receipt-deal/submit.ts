import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealSubmit } from '@fepkg/services/types/receipt-deal/submit';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

interface ISubmitReceiptDealUrgentById {
  receipt_deal_ids: string[];
  operation_source: OperationSource;
}

/**
 * @description 成交单提交
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/submit
 */
export const submitReceiptDeal = (params: ISubmitReceiptDealUrgentById, config?: RequestConfig) => {
  const { receipt_deal_ids, operation_source } = params;
  return request.post<ReceiptDealSubmit.Response, ReceiptDealSubmit.Request>(
    APIs.receiptDeal.submit,
    {
      receipt_deal_ids,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTReceiptDealSubmit,
        operation_source
      }
    },
    config
  );
};
