import type { BaseResponse, GranterIdAccess } from '../common';
import { ProductType } from '../enum';

/**
 * @description 更新被授权人信息
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/grantee_update
 */
export declare namespace UserAccessGrantGranteeUpdate {
  type Request = {
    product_type: ProductType; // 台子
    grantee_id: string;
    granter_access_list?: GranterIdAccess[]; // 指定人授权人列表
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
