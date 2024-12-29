import { RequestConfig } from '@fepkg/request/types';
import { APIs } from '@fepkg/services/apis';
import type { DealSpotPricingDetailGet } from '@fepkg/services/types/deal/spot-pricing-detail-get';
import request from '@/common/request';

/**
 * @description 获取idc成交详情
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/spot_pricing_detail/get
 */
export const getIDCDealDetail = (params: DealSpotPricingDetailGet.Request, config?: RequestConfig) => {
  return request.post<DealSpotPricingDetailGet.Response>(APIs.deal.spotPricingDetailGet, params, config);
};
