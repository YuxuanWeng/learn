import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { DealOperationType, OperationSource, ProductType } from '@fepkg/services/types/enum';
import { ReceiptDealMulAdd } from '@fepkg/services/types/receipt-deal/mul-add';
import request from '@/common/request';
import { miscStorage } from '@/localdb/miscStorage';

interface IAddReceiptDeal {
  receiptDealInfo: ReceiptDealMulAdd.CreateReceiptDeal;
  operationSource: OperationSource;
  productType: ProductType;
}

/**
 * @description 成交单录入
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_add
 */
export const addReceiptDeal = (params: IAddReceiptDeal, config?: RequestConfig) => {
  const { receiptDealInfo, operationSource, productType } = params;

  return request.post<ReceiptDealMulAdd.Response, ReceiptDealMulAdd.Request>(
    APIs.receiptDeal.mul_add,
    {
      create_receipt_deal_list: [receiptDealInfo],
      operation_info: {
        operator: miscStorage.userInfo?.user_id ?? '',
        operation_type: DealOperationType.DOTModifyDeal,
        operation_source: operationSource
      },
      product_type: productType
    },
    config
  );
};
