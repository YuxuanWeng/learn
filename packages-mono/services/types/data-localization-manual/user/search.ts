import type { BaseResponse, User } from '../../common';
import { Post, ProductType } from '../../enum';

/**
 * @description 根据台子搜索所有用户列表
 */
export declare namespace LocalUserSearch {
  type Request = {
    product_type: ProductType; // 当前台子
    keyword?: string; // 用户输入
    post_list?: Post[];
    offset?: number;
    count?: number;
    require_job_number?: boolean; // 是否要求经纪人有经纪人号码
  };

  type Response = {
    list?: User[]; // 用户列表
    has_more?: boolean;
    base_response?: BaseResponse;
  };
}
