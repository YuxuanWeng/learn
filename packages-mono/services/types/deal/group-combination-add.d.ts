import type { BaseResponse } from '../common';

/**
 * @description 增加合并分组
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/group_combination/add
 */
export declare namespace DealGroupCombinationAdd {
  type Request = {
    group_combination_name: string; // 合并分组名称
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
