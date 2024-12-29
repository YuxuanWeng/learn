import type { BaseResponse, BondDeal } from '../common';

/**
 * @description 校验n秒内有没有成交记录
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/check
 */
export declare namespace DealRecordCheck {
  type Request = {
    bond_key_market: string;
    current_timestamp: string;
    seconds: number;
  };

  type Response = {
    base_response?: BaseResponse;
    deal_list?: BondDeal[];
  };
}
