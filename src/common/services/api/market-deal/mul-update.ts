import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { MarketDealMulUpdate } from '@fepkg/services/types/market-deal/mul-update';
import request from '@/common/request';

/**
 * @description 市场成交-修改市场成交，包含Undo（支持批量）
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_update
 */
export const mulUpdateMarketDeal = (params: MarketDealMulUpdate.Request, config?: RequestConfig) => {
  return request.post<MarketDealMulUpdate.Response>(APIs.marketDeal.mulUpdate, params, config);
};
