import type { BaseResponse, FilterGroup } from '../common';
import { ProductType } from '../enum';

/**
 * @description 创建用户个人高级筛选分组设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/filter_group/upsert
 */
export declare namespace UserSettingFilterGroupUpsert {
  type Request = {
    filter_group: FilterGroup;
    product_type?: ProductType;
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
