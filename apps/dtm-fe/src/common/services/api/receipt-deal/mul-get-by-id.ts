import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import { ReceiptDealMulGetById } from '@fepkg/services/types/receipt-deal/mul-get-by-id';
import request from '@/common/request';

/**
 * @description 根据成交单Id查询 轮询接口
 * @url /api/v1/bdm/bds/bds_api/receipt_deal/mul_get_by_id
 */
export const fetchMulReceiptDeal = (params: ReceiptDealMulGetById.Request, config?: RequestConfig) => {
  return request.post<ReceiptDealMulGetById.Response>(APIs.receiptDeal.mulGetById, params, config);
};
