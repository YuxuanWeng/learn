import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondOptimalQuoteGetOptimalPrice } from '@fepkg/services/types/bond-optimal-quote/get-optimal-price';
import request from '@/common/request';

/**
 * @description 根据key_market获取最优报价的最优价格部分
 * @url /api/v1/bdm/bds/bds_api/bond_optimal_quote/get_optimal_price
 */
export const fetchBondOptimalQuoteGetOptimalPrice = (
  params: BondOptimalQuoteGetOptimalPrice.Request,
  config?: RequestConfig
) => {
  return request.post<BondOptimalQuoteGetOptimalPrice.Response>(APIs.bondOptimalQuote.getOptimalPrice, params, config);
};
