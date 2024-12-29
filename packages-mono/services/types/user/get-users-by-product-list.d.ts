import type { BaseResponse, User } from '../common';
import { ProductType } from '../enum';

/**
 * @description 根据product code list 查询用户列表
 * @method POST
 * @url /api/v1/bdm/bds/bds_api/user/get_users_by_product_list
 */
export declare namespace UserGetUsersByProductList {
  type Request = {
    product_type_list?: ProductType[];
    offset?: number;
    count?: number;
  };

  type Response = {
    status_code: number;
    status_msg: string;
    user?: User[];
    total?: number;
    base_response?: BaseResponse;
  };
}
