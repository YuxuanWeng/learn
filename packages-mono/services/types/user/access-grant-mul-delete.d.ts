import type { BaseResponse } from '../common';
import { ProductType, UserAccessGrantType } from '../enum';

/**
 * @description 删除用户授权列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/mul_delete
 */
export declare namespace UserAccessGrantMulDelete {
  type Request = {
    grantee_id?: string[]; // 被授权人id
    grant_type: UserAccessGrantType; // 授予权限类型
    product_type: ProductType; // 台子
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
