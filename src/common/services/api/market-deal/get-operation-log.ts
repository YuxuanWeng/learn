import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { MarketDealGetOperationLog } from '@fepkg/services/types/market-deal/get-operation-log';
import request from '@/common/request';

/**
 * @description 根据市场成交ID获取市场成交日志
 * @url /api/v1/bdm/bds/bds_api/market_deal/get_operation_log
 */
export const fetchMarketDealOperationLog = (params: MarketDealGetOperationLog.Request, config?: RequestConfig) => {
  return request.post<MarketDealGetOperationLog.Response>(APIs.marketDeal.getOperationLog, params, config);
};
