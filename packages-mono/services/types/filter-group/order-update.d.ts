import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 更新筛选分组
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/filter_group/order/update
 */
export declare namespace FilterGroupOrderUpdate {
  type Request = {
    product_type: ProductType;
    group_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
