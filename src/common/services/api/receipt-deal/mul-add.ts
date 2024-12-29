import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource, ProductType } from '@fepkg/services/types/enum';
import type { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

interface IMulAddReceiptDeal {
  create_receipt_deal_list: ReceiptDealMulAdd.CreateReceiptDeal[];
  operation_source: OperationSource;
  productType: ProductType;
}

/**
 * @description 成交单批量录入
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_add
 */
export const mulAddReceiptDeal = (params: IMulAddReceiptDeal, config?: RequestConfig) => {
  const { create_receipt_deal_list, operation_source, productType } = params;

  return request.post<ReceiptDealMulAdd.Response, ReceiptDealMulAdd.Request>(
    APIs.receiptDeal.mul_add,
    {
      create_receipt_deal_list,
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifyDeal,
        operation_source
      },
      flag_need_calculate: true,
      product_type: productType
    },
    config
  );
};
