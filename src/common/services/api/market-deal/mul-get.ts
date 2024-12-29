import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { MarketDealMulGet } from '@fepkg/services/types/market-deal/mul-get';
import request from '@/common/request';

/**
 * @description 批量获取市场成交详情
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_get
 */
export const mulGetMarketDeal = (params: MarketDealMulGet.Request, config?: RequestConfig) => {
  return request.post<MarketDealMulGet.Response>(APIs.marketDeal.mulGet, params, config);
};
