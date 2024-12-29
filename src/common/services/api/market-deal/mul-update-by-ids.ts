import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { MarketDealMulUpdateByIds } from '@fepkg/services/types/market-deal/mul-update-by-ids';
import request from '@/common/request';

/**
 * @description 市场成交- 右边栏批量更新到同一值
 * @url /api/v1/bdm/bds/bds_api/market_deal/mul_update_by_ids
 */
export const mulUpdateMarketDealByIds = (params: MarketDealMulUpdateByIds.Request, config?: RequestConfig) => {
  return request.post<MarketDealMulUpdateByIds.Response>(APIs.marketDeal.mulUpdateByIds, params, config);
};
