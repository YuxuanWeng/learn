import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealBridgeDelete } from '@fepkg/services/types/receipt-deal/bridge-delete';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

interface IDeleteReceiptDealUrgentById {
  receipt_deal_ids: string[];
  operation_source: OperationSource;
}

/**
 * @description 成交单删除桥
 * @url  /api/v1/bdm/bds/bds_api/receipt_deal/bridge-delete
 */
export const deleteBridgeReceiptDeal = (params: IDeleteReceiptDealUrgentById, config?: RequestConfig) => {
  const { receipt_deal_ids, operation_source } = params;
  return request.post<ReceiptDealBridgeDelete.Response, ReceiptDealBridgeDelete.Request>(
    APIs.receiptDeal.bridgeDelete,
    {
      receipt_deal_ids_list: [{ receipt_deal_id: receipt_deal_ids }],
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTDeleteBridge,
        operation_source
      }
    },
    config
  );
};

/**
 * @description 成交明细删除桥
 * @url  /api/v1/bdm/bds/bds_api/receipt_deal/bridge-delete
 */
export const deleteBridgeReceiptDealFromDealDetails = (
  params: ReceiptDealBridgeDelete.Request,
  config?: RequestConfig
) => {
  return request.post<ReceiptDealBridgeDelete.Response, ReceiptDealBridgeDelete.Request>(
    APIs.receiptDeal.bridgeDelete,
    params,
    config
  );
};
