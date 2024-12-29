import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealBridgeAssociate } from '@fepkg/services/types/receipt-deal/bridge-associate';
import request from '@/common/request';
import { requestWithModalFactory } from '@/common/request/with-modal-factory';
import { miscStorage } from '@/localdb/miscStorage';
import { toastRequestError } from '@/pages/Deal/Receipt/ReceiptDealForm/utils';

interface IDeleteReceiptDealUrgentById {
  receipt_deal_ids: string[];
  operation_source: OperationSource;
}

/**
 * @description 成交单桥关联
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/associate
 * @deprecated
 */
export const associateBridgeReceiptDeal = (params: IDeleteReceiptDealUrgentById, config?: RequestConfig) => {
  const { receipt_deal_ids, operation_source } = params;
  return request.post<ReceiptDealBridgeAssociate.Response, ReceiptDealBridgeAssociate.Request>(
    APIs.receiptDeal.bridgeAssociate,
    {
      receipt_deal_ids,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTAssociateBridge,
        operation_source
      }
    },
    config
  );
};

/** 成交单列表侧边栏关联 */
export const associateWithModal = requestWithModalFactory((receipt_deal_ids: string[], config) =>
  associateBridgeReceiptDeal(
    {
      receipt_deal_ids,
      operation_source: OperationSource.OperationSourceReceiptDeal
    },
    config
  ).catch(toastRequestError)
);
