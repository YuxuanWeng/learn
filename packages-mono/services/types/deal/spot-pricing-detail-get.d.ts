import type { BaseResponse, SpotPricingDetail } from '../common';

/**
 * @description 获取点价成交详情
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/spot_pricing_detail/get
 */
export declare namespace DealSpotPricingDetailGet {
  type Request = {
    deal_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
    spot_pricing_detail_list?: SpotPricingDetail[];
  };
}
