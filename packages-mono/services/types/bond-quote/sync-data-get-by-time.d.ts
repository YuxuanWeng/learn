import type { BaseResponse, BondQuoteSync } from '../common';

/**
 * @description 通过时间批量获取报价详情，IDC数据校验使用
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/bond_quote/sync_data/get_by_time
 */
export declare namespace BondQuoteSyncDataGetByTime {
  type Request = {
    start_time: string;
    end_time: string;
    count: number;
    quote_id?: string; // 分页使用
    update_time?: string; // 分页使用
  };

  type Response = {
    base_response?: BaseResponse;
    quote_list?: BondQuoteSync[];
  };
}
