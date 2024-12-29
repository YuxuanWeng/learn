import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 删除用户个人高级筛选分组设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/filter_group/delete
 */
export declare namespace UserSettingFilterGroupDelete {
  type Request = {
    group_id: string;
    product_type?: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
