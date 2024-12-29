import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { MarketDealMulCreate } from '@fepkg/services/types/market-deal/mul-create';
import request from '@/common/request';

/**
 * @description 市场成交-新增市场成交（支持批量）
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_create
 */
export const mulCreateMarketDeal = (params: MarketDealMulCreate.Request, config?: RequestConfig) => {
  return request.post<MarketDealMulCreate.Response>(APIs.marketDeal.mulCreate, params, config);
};
