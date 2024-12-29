import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealTradeOp } from '@fepkg/services/types/bds-common';
import { DealOperationType, OperationSource, ProductType } from '@fepkg/services/types/enum';
import { ReceiptDealUpdate } from '@fepkg/services/types/receipt-deal/update';
import { omit } from 'lodash-es';
import request from '@/common/request';
import { requestWithModalFactory } from '@/common/request/with-modal-factory';
import { miscStorage } from '@/localdb/miscStorage';

interface IUpdateReceiptDeal {
  receiptDealInfo: ReceiptDealUpdate.UpdateReceiptDeal;
  operationSource: OperationSource;
  productType?: ProductType; // 产品类型
}

/**
 * @description 成交单编辑
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/update
 */
export const updateReceiptDeal = (params: IUpdateReceiptDeal, config?: RequestConfig) => {
  const { receiptDealInfo, operationSource, productType } = params;

  return request.post<ReceiptDealUpdate.Response, ReceiptDealUpdate.Request>(
    APIs.receiptDeal.update,
    {
      receipt_deal_info: {
        ...receiptDealInfo,
        bid_trade_info: receiptDealInfo.bid_trade_info
          ? (omit(receiptDealInfo.bid_trade_info, ['inst', 'trader', 'broker']) as ReceiptDealTradeOp)
          : void 0,
        ofr_trade_info: receiptDealInfo.ofr_trade_info
          ? (omit(receiptDealInfo.ofr_trade_info, ['inst', 'trader', 'broker']) as ReceiptDealTradeOp)
          : void 0
      },
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

/** 成交单编辑面板 */
export const updateWithModal = requestWithModalFactory(updateReceiptDeal);
