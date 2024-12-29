import type { BaseResponse, BondDeal } from '../common';

/**
 * @description 查询成交列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/record/get_by_filter
 */
export declare namespace DealRecordGetByFilter {
  type Request = {
    deal_time?: string; // 成交日期查询，没有则是全部
  };

  type Response = {
    base_response?: BaseResponse;
    confirm_total?: number;
    deal_info_list?: BondDeal[];
  };
}
