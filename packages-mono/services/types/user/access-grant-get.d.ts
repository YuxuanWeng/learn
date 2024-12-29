import type { BaseResponse, UserAccessGrant } from '../common';
import { ProductType, UserAccessGrantType } from '../enum';

/**
 * @description 获取用户授权列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/get
 */
export declare namespace UserAccessGrantGet {
  type Request = {
    product_type: ProductType; // 台子
    grantee_id_list?: string[]; // 被授权人列表，可选字段，如果传入则只查这几个用户的授权人列表
    grant_type?: UserAccessGrantType; // 授予权限类型
  };

  type Response = {
    base_response?: BaseResponse;
    access_grant_list?: UserAccessGrant[];
  };
}
