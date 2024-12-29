import type { BaseResponse, BondQuoteSync } from '../common';

/**
 * @description 批量获取报价详情
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/sync_data/get
 */
export declare namespace BondQuoteSyncDataGet {
  type Request = {
    quote_id_list?: string[]; // 报价ID
    compressed?: boolean;
  };

  type Response = {
    base_response?: BaseResponse;
    quote_list?: BondQuoteSync[];
    data?: string;
  };
}
