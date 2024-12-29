import type { BaseResponse } from '../common';

/**
 * @description 删除筛选分组
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/filter_group/delete
 */
export declare namespace FilterGroupDelete {
  type Request = {
    group_id: string;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    base_response?: BaseResponse;
  };
}
