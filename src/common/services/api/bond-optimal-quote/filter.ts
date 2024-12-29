import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { BondOptimalQuoteFilter } from '@fepkg/services/types/bond-optimal-quote/filter';
import request from '@/common/request';

/**
 * @description 根据bondId获取最优报价
 * @url /api/v1/bdm/bds/bds_api/bond_optimal_quote/filter
 */
export const fetchBondOptimalQuoteByFilter = (params: BondOptimalQuoteFilter.Request, config?: RequestConfig) => {
  return request.post<BondOptimalQuoteFilter.Response>(APIs.bondOptimalQuote.filter, params, config);
};
