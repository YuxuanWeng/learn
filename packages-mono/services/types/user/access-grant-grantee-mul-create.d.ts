import type { BaseResponse } from '../common';
import { ProductType } from '../enum';

/**
 * @description 批量创建被授权人
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/access_grant/grantee_mul_create
 */
export declare namespace UserAccessGrantGranteeMulCreate {
  type Request = {
    product_type: ProductType; // 台子
    grantee_id_list?: string[];
  };

  type Response = {
    base_response?: BaseResponse;
  };
}
