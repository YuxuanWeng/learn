import type { BaseResponse, Trader } from '../common';

/**
 * @description 合并分组列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/group_combination/list
 */
export declare namespace DealGroupCombinationList {
  type Request = {
    // None in here...
  };

  type Response = {
    base_response?: BaseResponse;
    group_combination_list?: GroupCombination[];
  };

  export type GroupCombination = {
    group_combination_id: string; // 合并分组id
    group_combination_name: string; // 合并分组名称
    trader_info_list?: Trader[]; // 交易员信息list
  };
}
