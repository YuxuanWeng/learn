import type { BaseResponse, FilterGroup } from '../common';
import { ProductType } from '../enum';

/**
 * @description 获取用户个人高级筛选分组设置
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/setting/filter_group/get
 */
export declare namespace UserSettingFilterGroupGet {
  type Request = {
    product_type?: ProductType;
  };

  type Response = {
    filter_group_list?: FilterGroup[];
    base_response?: BaseResponse;
  };
}
