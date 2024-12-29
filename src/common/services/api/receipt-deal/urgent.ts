import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealUrgent } from '@fepkg/services/types/receipt-deal/urgent';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

interface IUpdateReceiptDealUrgentById {
  receipt_deal_ids: string[];
  flag_urgent: boolean;
  operation_source: OperationSource;
}

/**
 * @description 成交单加急
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/urgent
 */
export const urgentReceiptDeal = (params: IUpdateReceiptDealUrgentById, config?: RequestConfig) => {
  const { receipt_deal_ids, flag_urgent, operation_source } = params;
  return request.post<ReceiptDealUrgent.Response, ReceiptDealUrgent.Request>(
    APIs.receiptDeal.urgent,
    {
      receipt_deal_ids,
      flag_urgent,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifyDeal,
        operation_source
      }
    },
    config
  );
};
