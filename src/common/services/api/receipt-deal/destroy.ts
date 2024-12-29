import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealDestroy } from '@fepkg/services/types/receipt-deal/destroy';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

interface IDestroyReceiptDealDestroyByIds {
  destroyed_receipt_deal_list: ReceiptDealDestroy.DestroyedReceiptDeal[];
  operation_source: OperationSource;
}

/**
 * @description 成交单毁单
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/destroy
 */
export const destroyReceiptDeal = (params: IDestroyReceiptDealDestroyByIds, config?: RequestConfig) => {
  const { destroyed_receipt_deal_list, operation_source } = params;
  return request.post<ReceiptDealDestroy.Response, ReceiptDealDestroy.Request>(
    APIs.receiptDeal.destroy,
    {
      destroyed_receipt_deal_list,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTReceiptDealDestroy,
        operation_source
      }
    },
    config
  );
};
