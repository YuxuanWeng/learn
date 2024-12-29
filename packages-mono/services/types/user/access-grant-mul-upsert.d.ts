import type { BaseResponse, UserAccessGrant, UserAccessGrantUpsert } from '../common';
import { ProductType, UserAccessGrantType } from '../enum';

/**
 * @description 新建/更新用户授予权限
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/mul_upsert
 */
export declare namespace UserAccessGrantMulUpsert {
  type Request = {
    /** @deprecated */
    access_grant_list?: UserAccessGrantUpsert[]; // 用户授予权限列表
    /** @deprecated */
    grant_type?: UserAccessGrantType; // 授予权限类型    deprecated
    product_type: ProductType; // 台子
    user_access_grant_list?: UserAccessGrant[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
