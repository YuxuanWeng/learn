import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource } from '@fepkg/services/types/enum';
import { ReceiptDealMulUpdateBridge } from '@fepkg/services/types/receipt-deal/mul-update-bridge';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

/**
 * @description 批量编辑桥
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/bridge/mul_update
 */
export const mulUpdateBridge = (params: ReceiptDealMulUpdateBridge.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealMulUpdateBridge.Response>(
    APIs.bridge.mulUpdateBridge,
    {
      ...params,
      operation_info: {
        operator: miscStorage?.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifyDeal,
        operation_source: OperationSource.OperationSourceReceiptDealBridge
      }
    },
    config
  );
};
