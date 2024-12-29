import type { BaseResponse } from '../common';
import { Enable } from '../enum';

/**
 * @description 更改合并分组信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/deal/group_combination/update
 */
export declare namespace DealGroupCombinationUpdate {
  type Request = {
    group_combination_id: string; // 合并分组id
    group_combination_name?: string; // 合并分组名称
    trader_id_list?: string[]; // 交易员id列表
    enable?: Enable; // 删除标志位
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
